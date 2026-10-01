const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

/**
 * @route POST /api/interview/mock/:interviewId/answer
 * @description evaluate an answer in a live mock interview.
 * @access private
 */
interviewRouter.post("/mock/:interviewId/answer", authMiddleware.authUser, interviewController.evaluateMockAnswerController)

/**
 * @route GET /api/interview/mock/:interviewId/sessions
 * @description get completed mock interview sessions for an interview report.
 * @access private
 */
interviewRouter.get("/mock/:interviewId/sessions", authMiddleware.authUser, interviewController.getMockInterviewSessionsController)

/**
 * @route GET /api/interview/report/:interviewId/resources
 * @description fetch saved study resources for an interview report.
 * @access private
 */
interviewRouter.get("/report/:interviewId/resources", authMiddleware.authUser, interviewController.getStudyResourcesController)

/**
 * @route POST /api/interview/report/:interviewId/resources
 * @description generate or refresh study resources based on skill gaps for an interview report.
 * @access private
 */
interviewRouter.post("/report/:interviewId/resources", authMiddleware.authUser, interviewController.generateStudyResourcesController)

module.exports = interviewRouter