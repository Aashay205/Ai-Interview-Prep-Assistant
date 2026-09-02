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
    // Simple HTML tag stripper for text extraction
    const stripHtml = (html) => {
        return html
            .replace(/<style[^>]*>.*?<\/style>/gi, '')
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .trim()
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

            // Extract text from HTML
            const plainText = stripHtml(htmlContent)

            // Split into sections and format nicely
            const lines = plainText.split('\n').filter(line => line.trim())

            // Set base font
            doc.font('Helvetica', 11)
            doc.fillColor('#333333')

            // Add title if detected
            if (lines.length > 0) {
                const firstLine = lines[0].trim()
                if (firstLine.length < 100) {
                    doc.fontSize(18)
                    doc.font('Helvetica-Bold')
                    doc.text(firstLine, { align: 'center' })
                    doc.moveDown(0.5)
                    
                    // Reset font after title
                    doc.font('Helvetica', 11)
                    doc.fillColor('#333333')
                }
            }

            // Add content with smart formatting
            lines.slice(1).forEach((line, index) => {
                const trimmed = line.trim()
                
                if (!trimmed) return

                // Detect section headers (usually shorter, all caps or contains keywords)
                if (trimmed.length < 50 && 
                    (trimmed === trimmed.toUpperCase() || 
                     trimmed.includes('EXPERIENCE') ||
                     trimmed.includes('EDUCATION') ||
                     trimmed.includes('SKILLS') ||
                     trimmed.includes('ABOUT') ||
                     trimmed.includes('SUMMARY'))) {
                    
                    doc.moveDown(0.3)
                    doc.fontSize(12)
                    doc.font('Helvetica-Bold')
                    doc.fillColor('#1a1a1a')
                    doc.text(trimmed)
                    doc.moveDown(0.2)
                    
                    // Reset font
                    doc.font('Helvetica', 11)
                    doc.fillColor('#333333')
                } else {
                    // Regular content
                    doc.fontSize(10)
                    doc.font('Helvetica', 10)
                    doc.text(trimmed, {
                        align: 'left',
                        width: doc.page.width - 80,
                        continued: false
                    })
                    doc.moveDown(0.1)
                }
            })

            // Add footer with generation timestamp
            doc.moveDown()
            doc.fontSize(8)
            doc.fillColor('#999999')
            doc.text(
                `Generated on ${new Date().toLocaleDateString()}`,
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

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, evaluateMockAnswer, generateResumePdf }