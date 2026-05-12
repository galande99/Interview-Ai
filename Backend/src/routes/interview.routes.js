const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")    
const inteviewController = require("../controllers/interview.controllers")
const upload = require("../middlewares/file.middleware")    

const intereviewRouter = express.Router()


/**
 * @route POST /api/interview/
 * @description Generate interview report for a candidate based on their resume, self description and job description
 * @access Private
 */


intereviewRouter.post("/",authMiddleware.authUser,upload.single("resume")  ,inteviewController.generateInterviewReportController)


/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interview ID
 * @access Private
 */
intereviewRouter.get("/report/:interviewId",authMiddleware.authUser,inteviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description Get all interview reports of the logged in user
 * @access Private
 */

intereviewRouter.get("/",authMiddleware.authUser,inteviewController.getAllInterviewReportsController)


/**
 * @route POST /api/interview/resume/pdf
 * @description Generate resume in pdf format for a candidate based on their resume, self description and job description
 * @access Private
 */

intereviewRouter.post("/resume/pdf/:interviewReportId",authMiddleware.authUser,inteviewController.generateResumePdfController)

    module.exports = intereviewRouter