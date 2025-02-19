const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const fs = require("fs");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Welcome Route
app.get("/", (req, res) => {
    res.send("Welcome to the Social Media Content Analyzer API!");
});

// Multer Configuration
const upload = multer({ dest: "uploads/" });

// API to Upload and Process PDFs
app.post("/upload/pdf", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const pdfBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(pdfBuffer);
        res.json({ text: data.text });
    } catch (error) {
        res.status(500).json({ error: "Failed to extract text from PDF" });
    }
});

// API to Upload and Process Images (OCR)
app.post("/upload/image", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const result = await Tesseract.recognize(req.file.path, "eng");
        res.json({ text: result.data.text });
    } catch (error) {
        res.status(500).json({ error: "Failed to extract text from image" });
    }
});

// Readability Analysis
app.post("/analyze/readability", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    try {
        if (text.length < 10) {
            return res.status(400).json({ error: "Text is too short for readability analysis." });
        }

        // Count words, sentences, and syllables
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const syllables = countSyllables(text);

        if (sentences === 0 || words === 0 || syllables === 0) {
            return res.status(400).json({ error: "Invalid text for readability analysis." });
        }

        // Flesch-Kincaid Readability Score formula
        const fkScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));

        // Convert score to readability level
        let readabilityLevel;
        if (fkScore >= 90) {
            readabilityLevel = "Very Easy";
        } else if (fkScore >= 80) {
            readabilityLevel = "Easy";
        } else if (fkScore >= 70) {
            readabilityLevel = "Fairly Easy";
        } else if (fkScore >= 60) {
            readabilityLevel = "Standard";
        } else if (fkScore >= 50) {
            readabilityLevel = "Fairly Difficult";
        } else if (fkScore >= 30) {
            readabilityLevel = "Difficult";
        } else {
            readabilityLevel = "Very Difficult";
        }

        res.json({ readability: readabilityLevel, score: fkScore.toFixed(2) });

    } catch (error) {
        res.status(500).json({ error: "Failed to analyze readability" });
    }
});


function countSyllables(text) {
    text = text.toLowerCase();
    let words = text.split(/\s+/);
    let syllableCount = 0;

    words.forEach(word => {
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ''); 
        word = word.replace(/^y/, ''); // Remove starting 'y'
        let matches = word.match(/[aeiouy]{1,2}/g);
        syllableCount += matches ? matches.length : 1;
    });

    return syllableCount;
}

// 📌 Sentiment Analysis
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

app.post("/analyze/sentiment", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    try {
        const result = sentiment.analyze(text);
        const roundedScore = parseFloat(result.comparative.toFixed(2)); 
        res.json({ sentiment: roundedScore });
    } catch (error) {
        res.status(500).json({ error: "Failed to analyze sentiment" });
    }
});

// 📌 Hashtag Extraction
app.post("/analyze/hashtags", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    try {
        const hashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];
        if (hashtags.length === 0) {
        return res.json({ message: "No hashtags found", hashtags: [] });
        }
         res.json({ hashtags });
    } catch (error) {
        res.status(500).json({ error: "Failed to extract hashtags" });
    }
});

// Start the Server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
