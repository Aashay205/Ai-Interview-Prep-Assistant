const mongoose = require("mongoose")

const mockAnswerSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    feedback: { type: String, required: true },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] }
}, { _id: false })

const mockInterviewSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    interviewReport: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewReport", required: true },
    answers: { type: [mockAnswerSchema], required: true },
    averageScore: { type: Number, min: 0, max: 100, required: true },
    summary: { type: String, required: true },
    practicePriorities: { type: [String], default: [] }
}, { timestamps: true })

mockInterviewSessionSchema.index(
    { user: 1, interviewReport: 1, sessionId: 1 },
    { unique: true }
)

module.exports = mongoose.model("MockInterviewSession", mockInterviewSessionSchema)
