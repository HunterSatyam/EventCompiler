import { ATSScan } from "../models/atsScan.model.js";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";

// Helper to extract text from file
const extractText = async (file) => {
    if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(file.path);
        const data = await pdf(dataBuffer);
        return data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: file.path });
        return result.value;
    }
    throw new Error("Unsupported file type");
};

// Helper for keyword matching and scoring
const analyzeResume = (resumeText, jobDescription) => {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // 1. Keyword Analysis
    const stopWords = ["the", "and", "is", "in", "to", "for", "with", "content", "application", "resume", "description", "experience", "years", "work", "job", "will", "have", "that", "this", "from"];
    // Extract keywords from JD (naïve approach: words > 3 chars, appearing freq?)
    // Better: split by non-word chars, filter stop words, unique
    const jobWords = jobLower.match(/\b([a-z]{3,})\b/g) || [];
    const uniqueJobKeywords = [...new Set(jobWords.filter(w => !stopWords.includes(w)))];

    const matchedKeywords = [];
    const missingKeywords = [];

    uniqueJobKeywords.forEach(keyword => {
        if (resumeLower.includes(keyword)) {
            matchedKeywords.push(keyword);
        } else {
            missingKeywords.push(keyword);
        }
    });

    const keywordMatchRate = uniqueJobKeywords.length > 0 ? (matchedKeywords.length / uniqueJobKeywords.length) : 0;

    // 2. Section Analysis
    const sections = {
        education: /education|academic|degree/i.test(resumeLower),
        experience: /experience|employment|work history/i.test(resumeLower),
        skills: /skills|technologies|proficiencies/i.test(resumeLower),
        projects: /projects|portfolio/i.test(resumeLower),
        certifications: /certifications|certificates/i.test(resumeLower)
    };

    // 3. Contact Info Check
    const contactInfo = {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText),
        phone: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/.test(resumeText),
        linkedin: /linkedin\.com\/in\//i.test(resumeText),
        github: /github\.com\//i.test(resumeText)
    };

    // 4. Action Verbs Check (Sample list)
    const actionVerbs = ["led", "developed", "created", "managed", "designed", "implemented", "optimized", "achieved", "improved", "launched", "collaborated", "mentored"];
    const foundVerbs = actionVerbs.filter(verb => resumeLower.includes(verb));
    const verbScore = Math.min(foundVerbs.length / 5, 1); // Cap at 1 if 5+ verbs found

    // 5. Scoring Logic (Weighted)
    // Keywords: 40%, Sections: 30%, Contact: 20%, Verbs: 10%
    const sectionScore = (Object.values(sections).filter(Boolean).length / 5) * 100;
    const contactScore = (Object.values(contactInfo).filter(Boolean).length / 4) * 100;

    let totalScore = Math.round(
        (keywordMatchRate * 40) +
        (sectionScore * 0.30) +
        (contactScore * 0.20) +
        (verbScore * 10) // verbScore is 0-1, so * 100 * 0.1 = * 10
    );

    // Cap score at 100
    if (totalScore > 100) totalScore = 100;

    // 6. Generate detailed feedback
    const suggestions = [];

    // Critical Issues
    if (!contactInfo.email) suggestions.push({ type: "Critical", text: "Resume is missing an email address. Recruiters need this to contact you." });
    if (!contactInfo.phone) suggestions.push({ type: "Critical", text: "Resume is missing a phone number." });
    if (!sections.education) suggestions.push({ type: "Critical", text: "Education section not detected. Ensure you use a standard header like 'Education'." });
    if (!sections.experience) suggestions.push({ type: "Critical", text: "Experience section not detected. Ensure you use 'Experience' or 'Work History'." });

    // Improvements
    if (!contactInfo.linkedin) suggestions.push({ type: "Improvement", text: "Adding a LinkedIn profile URL increases credibility." });
    if (!sections.projects) suggestions.push({ type: "Improvement", text: "Projects section is missing. Showcasing projects is great for technical roles." });
    if (keywordMatchRate < 0.5) suggestions.push({ type: "Improvement", text: `Low keyword match (${Math.round(keywordMatchRate * 100)}%). Incorporate more terms from the job description.` });
    if (foundVerbs.length < 3) suggestions.push({ type: "Improvement", text: "Use more strong action verbs (e.g., Led, Developed, Optimized) to describe your achievements." });

    // Formatting
    if (resumeText.length < 500) suggestions.push({ type: "Formatting", text: "Resume might be too short. Aim for at least 400-600 words for a full page." });
    if (resumeText.length > 3000) suggestions.push({ type: "Formatting", text: "Resume might be too long. Keep it concise (1-2 pages)." });

    return {
        score: totalScore,
        matchedKeywords,
        missingKeywords,
        suggestions,
        details: {
            contactInfo,
            sections,
            foundVerbs
        }
    };
};

export const checkATSScore = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const file = req.file;

        if (!file || !jobDescription) {
            return res.status(400).json({ message: "Resume file and Job Description are required.", success: false });
        }

        const resumeText = await extractText(file);

        // Clean up uploaded file
        fs.unlinkSync(file.path);

        const analysis = analyzeResume(resumeText, jobDescription);

        // Save scan result (Simplified for MongoDB size, or detailed if needed)
        // Here we just return the full detailed analysis to frontend
        const atsScan = await ATSScan.create({
            userId: req.id,
            jobDescription,
            score: analysis.score,
            matchedKeywords: analysis.matchedKeywords,
            missingKeywords: analysis.missingKeywords,
            suggestions: analysis.suggestions.map(s => s.text), // Store just text for historical simple array
            fileName: file.originalname
        });

        // Return rich response
        return res.status(200).json({
            message: "ATS check completed successfully.",
            success: true,
            data: {
                ...atsScan.toObject(),
                detailedAnalysis: analysis // pass full detailed object for UI
            }
        });

    } catch (error) {
        console.error("ATS Check Error:", error);
        return res.status(500).json({ message: "Server error during ATS check.", success: false });
    }
};

export const getMyScans = async (req, res) => {
    try {
        const scans = await ATSScan.find({ userId: req.id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            scans
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error fetching scans.", success: false });
    }
};
