const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateStudyResources, evaluateMockAnswer, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const mockInterviewSessionModel = require("../models/mockInterviewSession.model")

const MAX_MOCK_QUESTIONS = 5




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    const { selfDescription, jobDescription } = req.body
    const hasResume = Boolean(req.file?.buffer)
    const hasSelfDescription = Boolean(selfDescription?.trim())

    if (!jobDescription?.trim()) {
        return res.status(400).json({
            message: "Job description is required."
        })
    }

    if (!hasResume && !hasSelfDescription) {
        return res.status(400).json({
            message: "Please upload a resume or provide a self-description."
        })
    }

    let resumeText = ""
    if (hasResume) {
        const resumeBuffer = Buffer.isBuffer(req.file.buffer) ? req.file.buffer : Buffer.from(req.file.buffer)
        const resumeUint8 = new Uint8Array(resumeBuffer)
        const resumeContent = await (new pdfParse.PDFParse(resumeUint8)).getText()
        resumeText = resumeContent.text
    }

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    try {
        // CRITICAL: Verify ownership before generating PDF
        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error generating resume PDF:", error.message, error.stack)
        
        // Check if it's an API rate limit error
        const isRateLimitError = error.status === "UNAVAILABLE" || error.code === 503 || error.message?.includes("high demand")
        if (isRateLimitError) {
            return res.status(503).json({
                message: "PDF generation service is temporarily overloaded. Please try again in a moment."
            })
        }
        
        // Check if it's a Puppeteer/Browser-related error
        if (error.message.includes("chrome") || error.message.includes("browser") || error.message.includes("puppeteer")) {
            return res.status(500).json({
                message: "PDF generation service is temporarily unavailable. Please try again later."
            })
        }
        
        res.status(500).json({
            message: "Error generating resume PDF. Please try again."
        })
    }
}

async function evaluateMockAnswerController(req, res) {
    const { interviewId } = req.params
    const { question, answer, history, sessionId } = req.body

    if (typeof question !== "string" || typeof answer !== "string" || answer.trim().length < 10) {
        return res.status(400).json({ message: "Please provide an answer of at least 10 characters." })
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    const previousExchanges = Array.isArray(history)
        ? history
            .filter(exchange => typeof exchange?.question === "string" && typeof exchange?.answer === "string")
            .slice(-MAX_MOCK_QUESTIONS + 1)
            .map(({ question: previousQuestion, answer: previousAnswer, feedback, score, strengths, improvements }) => ({
                question: previousQuestion.slice(0, 500),
                answer: previousAnswer.slice(0, 4000),
                ...(Number.isFinite(score) && {
                    score,
                    feedback: typeof feedback === "string" ? feedback.slice(0, 2000) : "",
                    strengths: Array.isArray(strengths) ? strengths.filter(item => typeof item === "string").slice(0, 8) : [],
                    improvements: Array.isArray(improvements) ? improvements.filter(item => typeof item === "string").slice(0, 8) : []
                })
            }))
        : []
    const askedQuestions = new Set([question, ...previousExchanges.map(exchange => exchange.question)].map(value => value.trim().toLowerCase()))
    const availableQuestions = [
        ...(interviewReport.technicalQuestions || []),
        ...(interviewReport.behavioralQuestions || [])
    ]
        .map(item => item.question)
        .filter(candidate => !askedQuestions.has(candidate.trim().toLowerCase()))
    const remainingQuestions = Math.max(0, MAX_MOCK_QUESTIONS - previousExchanges.length - 1)

    const feedback = await evaluateMockAnswer({
        role: `${interviewReport.title}\n${interviewReport.jobDescription}`,
        question,
        answer,
        history: previousExchanges,
        availableQuestions,
        remainingQuestions
    })

    if (remainingQuestions === 0 && typeof sessionId === "string" && sessionId.length <= 100) {
        const answers = [
            ...previousExchanges.filter(exchange => Number.isFinite(exchange.score)),
            {
                question: question.slice(0, 500),
                answer: answer.slice(0, 4000),
                score: feedback.score,
                feedback: feedback.feedback,
                strengths: feedback.strengths,
                improvements: feedback.improvements
            }
        ]
        const averageScore = Math.round(answers.reduce((total, item) => total + item.score, 0) / answers.length)

        await mockInterviewSessionModel.findOneAndUpdate(
            { user: req.user.id, interviewReport: interviewId, sessionId },
            {
                $set: {
                    answers,
                    averageScore,
                    summary: feedback.sessionSummary,
                    practicePriorities: feedback.practicePriorities
                }
            },
            { new: true, upsert: true, runValidators: true }
        )
    }

    res.status(200).json({ feedback })
}

async function getMockInterviewSessionsController(req, res) {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id }).select("_id")

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    const sessions = await mockInterviewSessionModel.find({
        interviewReport: interviewId,
        user: req.user.id
    }).sort({ createdAt: -1 }).select("-__v")

    res.status(200).json({ sessions })
}

async function getStudyResourcesController(req, res) {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    return res.status(200).json({
        message: "Study resources fetched successfully.",
        studyResources: interviewReport.studyResources || []
    })
}

async function generateStudyResourcesController(req, res) {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    const hasSavedResources = Array.isArray(interviewReport.studyResources) && interviewReport.studyResources.length > 0
    const shouldRefresh = req.body?.refresh === true

    if (hasSavedResources && !shouldRefresh) {
        return res.status(200).json({
            message: "Saved study resources fetched successfully.",
            studyResources: interviewReport.studyResources
        })
    }

    const skillGaps = Array.isArray(interviewReport.skillGaps)
        ? interviewReport.skillGaps.map(({ skill, severity }) => ({ skill, severity }))
        : []
    const studyResources = await generateStudyResources({
        jobTitle: interviewReport.title,
        skillGaps
    })

    interviewReport.studyResources = studyResources
    await interviewReport.save()

    return res.status(200).json({
        message: shouldRefresh ? "Study resources refreshed successfully." : "Study resources generated successfully.",
        studyResources
    })
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, evaluateMockAnswerController, getMockInterviewSessionsController, getStudyResourcesController, generateStudyResourcesController }