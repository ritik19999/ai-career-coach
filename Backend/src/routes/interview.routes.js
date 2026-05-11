const express = require("express");

const upload = require("../middlewares/file.middleware");
const { authUser } = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume,job description
 * @access private
 */

interviewRouter.post("/", authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interview id
 * @access private
 */


interviewRouter.get("/report/:interviewId/", authUser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user
 * @access private
 */

interviewRouter.get("/", authUser, interviewController.getAllInterviewReportsController)


/**
 * @route POST /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user resume,self description and job description
 * @access private
 * 
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter;