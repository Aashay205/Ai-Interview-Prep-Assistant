const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const PDFDocument = require("pdfkit")
const { Readable } = require("stream")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

/**
 * Retry helper with exponential backoff for API calls
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} initialDelayMs - Initial delay in milliseconds (default: 1000)
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelayMs = 1000) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            const isRateLimitError = error.status === "UNAVAILABLE" || error.code === 503 || error.message?.includes("high demand")
            const isLastAttempt = attempt === maxRetries
            
            if (!isRateLimitError || isLastAttempt) {
                throw error
            }
            
            // Exponential backoff: 1s, 2s, 4s, 8s...
            const delayMs = initialDelayMs * Math.pow(2, attempt)
            console.log(`API rate limit hit. Retrying in ${delayMs}ms... (Attempt ${attempt + 1}/${maxRetries})`)
            
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
    }
}


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    // Use retry logic to handle API rate limiting
    const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        })
    }, 3, 2000) // 3 retries with 2 second initial delay

    return JSON.parse(response.text)


}

async function evaluateMockAnswer({ role, question, answer, history }) {
    const mockAnswerSchema = z.object({
        score: z.number().min(0).max(100),
        feedback: z.string(),
        strengths: z.array(z.string()),
        improvements: z.array(z.string()),
        followUpQuestion: z.string()
    })

    const prompt = `Act as a fair, demanding interview coach. Evaluate this candidate answer.
Role and job context: ${role}
Current question: ${question}
Candidate answer: ${answer}
Previous exchange summary: ${history || "This is the first question."}

Score the answer for correctness, relevance, clarity, and evidence. Give concise, actionable feedback.
Ask one natural follow-up question that probes the weakest or most important part of the answer.`

    // Use retry logic to handle API rate limiting
    const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(mockAnswerSchema),
            }
        })
    }, 3, 2000) // 3 retries with 2 second initial delay

    return JSON.parse(response.text)
}



async function generatePdfFromHtml(htmlContent) {
    // Better HTML parsing that preserves content
    const parseHtmlContent = (html) => {
        let text = html;
        
        // Remove script and style tags completely
        text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
        
        // Replace line breaks with newlines
        text = text.replace(/<br\s*\/?>/gi, '\n');
        text = text.replace(/<\/p>/gi, '\n');
        text = text.replace(/<\/div>/gi, '\n');
        text = text.replace(/<\/li>/gi, '\n');
        text = text.replace(/<\/h[1-6]>/gi, '\n');
        
        // Remove all remaining HTML tags
        text = text.replace(/<[^>]+>/g, '');
        
        // Decode HTML entities
        text = text
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
        
        // Clean up whitespace
        text = text.replace(/\n\n+/g, '\n\n'); // Remove multiple blank lines
        text = text.replace(/[ \t]+\n/g, '\n'); // Remove trailing spaces
        text = text.replace(/\n[ \t]+/g, '\n'); // Remove leading spaces after newline
        
        return text.trim();
    }

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 40,
                bufferPages: true
            })

            const pdfBuffer = []

            doc.on('data', (chunk) => {
                pdfBuffer.push(chunk)
            })

            doc.on('end', () => {
                resolve(Buffer.concat(pdfBuffer))
            })

            doc.on('error', (error) => {
                reject(error)
            })

            // Extract and clean text from HTML
            const plainText = parseHtmlContent(htmlContent)
            
            if (!plainText || plainText.length === 0) {
                console.warn("Warning: Parsed content is empty, using raw HTML as fallback");
                doc.fontSize(10).text(htmlContent);
                doc.end();
                return;
            }

            // Split content into lines
            const lines = plainText.split('\n').filter(line => line.trim());

            if (lines.length === 0) {
                console.warn("Warning: No lines extracted from content");
                doc.fontSize(10).text("Resume content could not be parsed. Please try again.");
                doc.end();
                return;
            }

            // Set base font
            doc.font('Helvetica', 10)
            doc.fillColor('#333333')

            // Process each line
            lines.forEach((line) => {
                const trimmed = line.trim()
                if (!trimmed) return

                // Detect headers (typically short, uppercase, or known keywords)
                const isHeader = trimmed.length < 60 && (
                    trimmed === trimmed.toUpperCase() ||
                    /^(EXPERIENCE|EDUCATION|SKILLS|ABOUT|SUMMARY|CONTACT|PROJECTS|CERTIFICATIONS|LANGUAGES|TECHNICAL|PROFESSIONAL)/.test(trimmed.toUpperCase())
                )

                if (isHeader) {
                    // Add spacing before header
                    if (doc.y > 50) doc.moveDown(0.3)
                    
                    // Format as header
                    doc.fontSize(11)
                    doc.font('Helvetica-Bold')
                    doc.fillColor('#1a1a1a')
                    doc.text(trimmed)
                    
                    // Add underline effect
                    const x = doc.x;
                    const width = doc.widthOfString(trimmed);
                    doc.moveTo(x, doc.y).lineTo(x + width, doc.y).stroke('#cccccc');
                    
                    doc.moveDown(0.2)
                    doc.font('Helvetica', 10)
                    doc.fillColor('#333333')
                } else {
                    // Regular content line
                    doc.fontSize(10)
                    doc.font('Helvetica')
                    
                    // Detect job titles, companies, dates (lines with specific patterns)
                    const isBold = /^\w+.*(?:at|@|\||—|-)/.test(trimmed) && trimmed.length < 80;
                    
                    if (isBold) {
                        doc.font('Helvetica-Bold')
                        doc.fillColor('#1a1a1a')
                    } else {
                        doc.font('Helvetica')
                        doc.fillColor('#333333')
                    }
                    
                    // Text with word wrapping
                    doc.text(trimmed, {
                        align: 'left',
                        width: doc.page.width - 80
                    })
                }
            })

            // Add footer
            doc.moveDown()
            doc.fontSize(8)
            doc.font('Helvetica')
            doc.fillColor('#999999')
            doc.text(
                `Generated on ${new Date().toLocaleDateString()} • PDF Resume`,
                { align: 'center' }
            )

            // Finalize PDF
            doc.end()

        } catch (error) {
            reject(new Error(`PDF generation failed: ${error.message}`))
        }
    })
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    // Use retry logic to handle API rate limiting
    const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
            }
        })
    }, 3, 2000) // 3 retries with 2 second initial delay

    const jsonContent = JSON.parse(response.text)
    
    // Validate HTML content exists
    if (!jsonContent.html || jsonContent.html.trim().length === 0) {
        throw new Error("Gemini API returned empty HTML content for resume")
    }
    
    console.log(`Generating PDF from HTML content (${jsonContent.html.length} characters)`)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, evaluateMockAnswer, generateResumePdf }