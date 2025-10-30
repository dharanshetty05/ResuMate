const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const PDFParser = require("pdf2json");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: "uploads/" });

// Route 1: Basic health check
app.get("/", (req, res) => {
    res.send("ResuMate Backend is running successfully");
});

// Route 2: Handle PDF upload + extract text
app.post("/api/upload", upload.single("file"), async(req, res) => {
    try{
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (errData) => {
            console.error("PDF parse error:", errData.parserError);
            res.status(500).json({ error: "Failed to extract PDF text" });
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            const text = pdfData.Pages.map((page) => 
            page.Texts.map((t) =>
                decodeURIComponent(t.R.map((r) => r.T).join(""))
                ).join(" ")
            ).join("\n\n");

            fs.unlinkSync(req.file.path);

            res.json({ text });
        });

        pdfParser.loadPDF(req.file.path);
    } catch(error) {
        console.error("Error extracting PDF:", error);
        res.status(500).json({ error: "Failed to extract PDF text" });
    }
});

// Router 3: Mock AI Tailoring
app.post("/api/tailor", async(req, res) => {
    const {resumeText, jobDescription } = req.body;

    res.json({
        tailoredText: `Mock AI response for the job: ${jobDescription.slice(0, 50)}...`,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
