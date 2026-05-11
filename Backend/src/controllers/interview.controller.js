const pdfParse = require("pdf-parse").default || require("pdf-parse");
const generateInterviewReport = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description controller to generate interview report based on user self description,resume and job description
 */

async function generateInterViewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        console.log("AI RESPONSE:", interviewReportByAi);
        function normalizeAIResponse(data) {
            return {
                matchScore: data.matchScore || 0,
                title: data.title || data.job_title || "Unknown Role",

                technicalQuestions: (data.technicalQuestions || []).map(q => ({
                    question: typeof q === "string" ? q : q.question,
                    intention: typeof q === "string" ? "Assess technical knowledge" : q.intention,
                    answer: typeof q === "string" ? "Explain concepts with examples" : q.answer
                })),

                behavioralQuestions: (data.behavioralQuestions || []).map(q => ({
                    question: typeof q === "string" ? q : q.question,
                    intention: typeof q === "string" ? "Evaluate soft skills" : q.intention,
                    answer: typeof q === "string" ? "Use STAR method" : q.answer
                })),

                skillGaps: (data.skillGaps || []).map(s => ({
                    skill: typeof s === "string" ? s : s.skill,
                    severity: typeof s === "string" ? "high" : s.severity
                })),

                preparationPlan: (data.preparationPlan || []).map((p, index) => ({
                    day: typeof p === "string" ? index + 1 : p.day,
                    focus: typeof p === "string" ? p : p.focus,
                    tasks: typeof p === "string" ? [p] : p.tasks
                }))
            };
        } const normalized = normalizeAIResponse(interviewReportByAi);

        const interviewReport = await interviewReportModel.create({
            user: req.user.id || req.user._id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...normalized
        });

        res.status(201).json({
            message: "Interview Report generated successfully",
            interviewReport
        });

    } catch (err) {
        console.error("ERROR:", err);

        res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
}

/**
 * 
 * @description controller to get interview report by interview id
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    res.status(200).json({
        message: "interview report fetched successfully",
        interviewReport
    })
}


/**
 * @description controller to get all interview reports of logged in user
 */

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

/**
 * @description controller to generate resume pdf based on user self description,job descriptuon and resume
 */

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    const { resume, selfDescription, jobDescription } = interviewReport;

    const pdfBuffer = await generateInterviewReport.generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment;filename=resume_${interviewReportId}.pdf`
    })
    res.send(pdfBuffer)
}

module.exports = {
    generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController,
    generateResumePdfController
}