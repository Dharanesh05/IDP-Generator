import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or holds the placeholder value. Falling back to high-quality template-based generator.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Generate tailored fallback mock data when API key is missing
function generateFallbackIDP(major: string, skills: string, goals: string, level: string, commitment: string): any {
  const cleanedMajor = major.trim() || "Computer Science";
  const cleanedSkills = skills.split(",").map(s => s.trim()).filter(Boolean);
  const skillListStr = cleanedSkills.length > 0 ? cleanedSkills.join(", ") : "Programming, Problem Solving";
  const cleanedGoals = goals.trim() || "Full Stack Software Engineer";
  const upperLevel = level.charAt(0).toUpperCase() + level.slice(1);

  return {
    isMock: true,
    summary: `Based on your profile as a ${upperLevel} studying/specializing in ${cleanedMajor} with target goals in ${cleanedGoals}, here is a tailored Individual Development Plan (IDP). Focus on converting your baseline skills in ${skillListStr} into industry-ready capabilities over ${commitment} of weekly commitment.`,
    suggestedRoles: [
      `${cleanedGoals}`,
      `Associate software engineer in ${cleanedMajor}-adjacent industries`,
      `Technical Specialist (${cleanedMajor})`
    ],
    certifications: [
      {
        id: "cert_1",
        title: `Professional Certificate in Advanced ${cleanedMajor} Concepts`,
        providerOrPlatform: "Coursera (Google/IBM)",
        description: `A highly regarded professional certificate designed to solidify core foundational skills in ${cleanedMajor} and prepare you for ${cleanedGoals} roles.`,
        link: "https://www.coursera.org",
        difficultyOrTime: "6-8 weeks",
        skillsAcquired: ["Core Concepts", "Industry Best Practices", "Software Lifecycle"],
        actionLabel: "Explore Course",
        isPaid: true,
        priceInfo: "Paid Certificate"
      },
      {
        id: "cert_2",
        title: "Frontend Developer Professional Certification",
        providerOrPlatform: "freeCodeCamp / Meta",
        description: "Comprehensive hands-on training focusing on responsive user experience, web standards, and modern design frameworks.",
        link: "https://www.freecodecamp.org",
        difficultyOrTime: "4 weeks",
        skillsAcquired: ["Responsive Web Design", "HTML5 & CSS3", "UI/UX Principles"],
        actionLabel: "Start Free Certification",
        isPaid: false,
        priceInfo: "Free"
      }
    ],
    projects: [
      {
        id: "proj_1",
        title: `Next-Gen Portfolio Project for ${cleanedGoals}`,
        providerOrPlatform: "Self-Guided (GitHub)",
        description: `Build a highly interactive, responsive full-stack platform showcasing advanced features using ${skillListStr}. Incorporate dark mode with interactive elements to display as a top portfolio piece.`,
        link: "https://github.com",
        difficultyOrTime: "2-3 weeks",
        skillsAcquired: ["End-to-End Development", "Git Version Control", "Tailwind Styling"],
        actionLabel: "Initialize Repository"
      },
      {
        id: "proj_2",
        title: "Open Source Contribution on Modern Libraries",
        providerOrPlatform: "GitHub Community",
        description: "Contribute to a major repository or documentation related to your domain. Solves real issues and proves your collaboration skills.",
        link: "https://github.com/explore",
        difficultyOrTime: "Ongoing",
        skillsAcquired: ["Open Source workflow", "Code Review", "Collaboration"],
        actionLabel: "Find Good First Issues"
      }
    ],
    codingPractice: [
      {
        id: "coding_1",
        title: "Top 50 Interview Questions Collection",
        providerOrPlatform: "LeetCode",
        description: `Solve 50 highly curated questions covering basic to intermediate arrays, strings, and hash tables. Ideal for testing your skill in ${skillListStr}.`,
        link: "https://leetcode.com/problemset/all/",
        difficultyOrTime: "Daily (1-2 hours)",
        skillsAcquired: ["Data Structures", "Algorithms", "Time Complexity Analysis"],
        actionLabel: "Start Practicing"
      },
      {
        id: "coding_2",
        title: "Language Mastery Path",
        providerOrPlatform: "Exercism / HackerRank",
        description: "Follow the specialized programming track for your chosen language to learn advanced idioms and syntactic sugar.",
        link: "https://exercism.org",
        difficultyOrTime: "15 mins / day",
        skillsAcquired: ["Code Syntax", "Language Idioms", "Testing"],
        actionLabel: "Choose Language Track"
      }
    ],
    aptitudePractice: [
      {
        id: "aptitude_1",
        title: "Quantitative Aptitude & Logical Reasoning",
        providerOrPlatform: "IndiaBIX",
        description: "Practice arithmetic, verbal logic, and non-verbal reasoning commonly featured in top MNC preliminary screening rounds.",
        link: "https://www.indiabix.com",
        difficultyOrTime: "30 mins / day",
        skillsAcquired: ["Logical Thinking", "Mental Math", "Problem Solving Speed"],
        actionLabel: "Practice Online"
      },
      {
        id: "aptitude_2",
        title: "Core Computer Science Theory & MCQs",
        providerOrPlatform: "GeeksforGeeks",
        description: "Deep dive into OS, DBMS, Computer Networks, and DBMS relational modeling to ace core conceptual questionnaires.",
        link: "https://www.geeksforgeeks.org",
        difficultyOrTime: "Weekly Prep",
        skillsAcquired: ["Database Concepts", "Network Layers", "Operating Systems"],
        actionLabel: "View CS Theory MCQs"
      }
    ],
    softSkills: [
      {
        id: "soft_1",
        title: "The Art of Tech Communication and Presentation",
        providerOrPlatform: "YouTube / edX",
        description: "Learn how to explain complex technical diagrams and code decisions to non-technical stakeholders concisely.",
        link: "https://www.edx.org",
        difficultyOrTime: "1 hour / week",
        skillsAcquired: ["Technical Pitching", "Active Listening", "Stakeholder Alignment"],
        actionLabel: "Watch Lectures"
      },
      {
        id: "soft_2",
        title: "Collaborative Agile & Teamwork Workflows",
        providerOrPlatform: "Atlassian University",
        description: "Get familiar with Scrum, Jira ticket grooming, writing precise commit logs, and conducting asynchronous standups.",
        link: "https://university.atlassian.com",
        difficultyOrTime: "3 hours total",
        skillsAcquired: ["Agile/Scrum", "Jira", "Technical Documentation"],
        actionLabel: "Get Free Certificate"
      }
    ],
    resumeImprovements: [
      {
        id: "resume_1",
        title: "ATS-Friendly Markdown Format Upgrade",
        providerOrPlatform: "ATS Best Practices",
        description: `Structure your resume using single-column, clear section headings, and explicit keywords like ${skillListStr} to pass screening filters easily.`,
        link: "https://www.overleaf.com/gallery/tagged/cv",
        difficultyOrTime: "1-2 hours",
        skillsAcquired: ["ATS Optimization", "Markdown CV Styling", "Professional Layouts"],
        actionLabel: "View Resume Templates"
      },
      {
        id: "resume_2",
        title: "Incorporate 'X-Y-Z' Impact Formula",
        providerOrPlatform: "Google Careers Tip",
        description: "Format accomplishments as 'Accomplished [X] as measured by [Y], by doing [Z]'. Example: 'Sped up database retrieval by 40% (Y) by indexing query columns (Z)'.",
        difficultyOrTime: "30 mins",
        skillsAcquired: ["Action-Oriented Writing", "Metric Quantification", "Self-Presentation"],
        actionLabel: "Rewrite Bullet Points"
      }
    ],
    interviewPrep: [
      {
        id: "interview_1",
        title: "Interactive Peer Mock Interviews",
        providerOrPlatform: "Pramp / Interviewing.io",
        description: "Practice live interviewing with peer developers. Take turns acting as interviewer and candidate to build confidence under pressure.",
        link: "https://www.pramp.com",
        difficultyOrTime: "2 mock sessions",
        skillsAcquired: ["Whiteboarding", "Explaining Code Aloud", "Behavioral Answers"],
        actionLabel: "Book Free Mock Interview"
      },
      {
        id: "interview_2",
        title: "STAR Behavioral Framework Mastery",
        providerOrPlatform: "Behavioral Prep Guide",
        description: "Prepare 5 concrete stories from your academic/project background using Situation, Task, Action, and Result to excel in cultural interviews.",
        difficultyOrTime: "1 hour",
        skillsAcquired: ["STAR Methodology", "Leadership Stories", "Handling Conflict"],
        actionLabel: "Prepare Answers"
      }
    ]
  };
}

// API Route for IDP Recommendation
app.post("/api/generate-idp", async (req, res) => {
  try {
    const { major, skills, goals, experienceLevel, timeCommitment } = req.body;

    if (!major || !skills || !goals) {
      res.status(400).json({ error: "Missing required fields: major, skills, and goals are required." });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response with helpful indicator
      const fallback = generateFallbackIDP(major, skills, goals, experienceLevel || "intermediate", timeCommitment || "10 hours/week");
      res.json(fallback);
      return;
    }

    // Prepare prompt
    const prompt = `You are a professional career coach and education consultant. Generate a highly personalized Individual Development Plan (IDP) for a student with the following profile:
- Major/Specialization: ${major}
- Current Skills: ${skills}
- Career Goals/Target Roles: ${goals}
- Experience Level: ${experienceLevel || 'intermediate'}
- Weekly Time Commitment: ${timeCommitment || '10 hours/week'}

For the certifications field, provide a mix of highly relevant free certification courses (e.g. from freeCodeCamp, edX free audit, Coursera free audit, Kaggle) and premier paid/professional certifications (e.g. AWS Certified, Coursera/Meta professional certificates, Oracle, Cisco). Ensure you label each certification's cost status accurately.
Provide extremely realistic, concrete, actionable, and state-of-the-art recommendations. Do not use generic placeholders.
Your response MUST be fully populated, highly relevant to their target goals, and match the specified JSON schema exactly.`;

    const systemInstruction = `You are an elite AI Career Advisory System. Your task is to output a comprehensive and highly specific Individual Development Plan (IDP) in valid JSON format.
Ensure that each list of items has exactly 2 to 4 high-quality, practical entries. For certifications, make sure to classify whether it is paid (isPaid: true, priceInfo: e.g. "Paid Certificate") or free (isPaid: false, priceInfo: "Free"). Give exact course names, popular platforms, github projects, and real interview advice customized for this specific student.`;

    // Generate content using the recommended Gemini model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A customized summary of their development plan and strategic steps.",
            },
            suggestedRoles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 highly specific job positions or roles suited for their path.",
            },
            certifications: {
              type: Type.ARRAY,
              description: "Specific free or widely accessible certification courses with providers.",
              items: {
                type: Type.OBJECT,
                properties: {
                   id: { type: Type.STRING },
                   title: { type: Type.STRING },
                   providerOrPlatform: { type: Type.STRING },
                   description: { type: Type.STRING },
                   link: { type: Type.STRING },
                   difficultyOrTime: { type: Type.STRING },
                   skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } },
                   actionLabel: { type: Type.STRING },
                   isPaid: { type: Type.BOOLEAN, description: "Whether this certification requires payment/is a paid certification." },
                   priceInfo: { type: Type.STRING, description: "Detailed cost information (e.g. 'Free', 'Free Audit', 'Paid ($49)', 'Subscription')" }
                },
                required: ["id", "title", "providerOrPlatform", "description"]
              }
            },
            projects: {
              type: Type.ARRAY,
              description: "Tailored projects the student can build from scratch to build their portfolio.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  providerOrPlatform: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  difficultyOrTime: { type: Type.STRING },
                  skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actionLabel: { type: Type.STRING }
                },
                required: ["id", "title", "providerOrPlatform", "description"]
              }
            },
            codingPractice: {
              type: Type.ARRAY,
              description: "Coding practice modules, challenge tracks, or interactive labs.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  providerOrPlatform: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  difficultyOrTime: { type: Type.STRING },
                  skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actionLabel: { type: Type.STRING }
                },
                required: ["id", "title", "providerOrPlatform", "description"]
              }
            },
            aptitudePractice: {
              type: Type.ARRAY,
              description: "Aptitude, analytical, and logical reasoning exercises/websites.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  providerOrPlatform: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  difficultyOrTime: { type: Type.STRING },
                  skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actionLabel: { type: Type.STRING }
                },
                required: ["id", "title", "providerOrPlatform", "description"]
              }
            },
            softSkills: {
              type: Type.ARRAY,
              description: "Actionable recommendations to improve public speaking, technical writeups, or team coordination.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  providerOrPlatform: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  difficultyOrTime: { type: Type.STRING },
                  skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actionLabel: { type: Type.STRING }
                },
                required: ["id", "title", "providerOrPlatform", "description"]
              }
            },
            resumeImprovements: {
              type: Type.ARRAY,
              description: "Specific formatting tips, wording advice, or key sections to highlight for ATS scoring.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  providerOrPlatform: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  difficultyOrTime: { type: Type.STRING },
                  skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actionLabel: { type: Type.STRING }
                },
                required: ["id", "title", "providerOrPlatform", "description"]
              }
            },
            interviewPrep: {
              type: Type.ARRAY,
              description: "Interview formats to master (such as STAR behavioral stories, whiteboard system design, coding rounds).",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  providerOrPlatform: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  difficultyOrTime: { type: Type.STRING },
                  skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actionLabel: { type: Type.STRING }
                },
                required: ["id", "title", "providerOrPlatform", "description"]
              }
            }
          },
          required: [
            "summary",
            "suggestedRoles",
            "certifications",
            "projects",
            "codingPractice",
            "aptitudePractice",
            "softSkills",
            "resumeImprovements",
            "interviewPrep"
          ]
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty text returned from Gemini API");
    }

    const resultJson = JSON.parse(text.trim());
    res.json({
      ...resultJson,
      isMock: false
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Failed to generate plan via Gemini AI",
      details: error.message || error
    });
  }
});

// API Route for Floating IDP AI Assistant Chat
app.post("/api/chat-idp", async (req, res) => {
  try {
    const { message, history, studentProfile, idp } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const ai = getGeminiClient();

    // Context summary string for fallback or prompt
    const majorStr = studentProfile?.major || "Computer Science / Tech";
    const goalsStr = studentProfile?.goals || "Software Career";
    const summaryStr = idp?.summary || "Personalized Individual Development Plan";

    if (!ai) {
      // Intelligently formatted fallback reply
      let fallbackAnswer = `Regarding your question on "${message}":\n\nBased on your IDP profile for **${majorStr}** targeting **${goalsStr}**, we recommend prioritizing your highest impact items first. `;
      if (message.toLowerCase().includes("certif")) {
        fallbackAnswer += `Check the **Free Certifications** track first to build foundational credentials at zero cost before committing to paid industry standard certificates.`;
      } else if (message.toLowerCase().includes("project")) {
        fallbackAnswer += `Focus on building end-to-end GitHub portfolio pieces that demonstrate practical application of your core skills: ${studentProfile?.skills || "Programming"}.`;
      } else if (message.toLowerCase().includes("interview") || message.toLowerCase().includes("resume")) {
        fallbackAnswer += `Use the STAR method (Situation, Task, Action, Result) for behavioral questions and ensure your resume contains quantified impact numbers.`;
      } else {
        fallbackAnswer += `Follow your weekly ${studentProfile?.timeCommitment || "study commitment"} schedule and log your daily progress using the Login Streak engine to maximize momentum!`;
      }

      res.json({ reply: fallbackAnswer });
      return;
    }

    // Build system instruction and context
    const systemInstruction = `You are a world-class AI Career Advisor and IDP Specialist.
You are assisting a student with specific questions about their Individual Development Plan (IDP).

STUDENT PROFILE:
- Major: ${studentProfile?.major || "Computer Science"}
- Skills: ${studentProfile?.skills || "Software Engineering"}
- Target Career Goals: ${studentProfile?.goals || "Software Engineer"}
- Experience Level: ${studentProfile?.experienceLevel || "Intermediate"}
- Weekly Time Commitment: ${studentProfile?.timeCommitment || "10 hours/week"}

GENERATED IDP SUMMARY & RECOMMENDATIONS:
- Plan Summary: ${summaryStr}
- Suggested Target Roles: ${JSON.stringify(idp?.suggestedRoles || [])}
- Certifications: ${JSON.stringify(idp?.certifications || [])}
- Projects: ${JSON.stringify(idp?.projects || [])}
- Coding Practice: ${JSON.stringify(idp?.codingPractice || [])}
- Aptitude Practice: ${JSON.stringify(idp?.aptitudePractice || [])}
- Soft Skills: ${JSON.stringify(idp?.softSkills || [])}
- Resume Improvements: ${JSON.stringify(idp?.resumeImprovements || [])}
- Interview Prep: ${JSON.stringify(idp?.interviewPrep || [])}

GUIDELINES:
1. Give direct, empathetic, actionable advice formatted in clean markdown (using bold terms, concise bullet points when appropriate).
2. Directly address their specific question referencing items from their generated IDP recommendations when applicable.
3. Keep answers focused, practical, and limited to 2-4 short paragraphs or bullet points. Do not give fluff or excessive pleasantries.`;

    // Format chat history for Gemini API
    const formattedHistory = (history || []).slice(-8).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    const contents = [
      ...formattedHistory,
      { role: "user", parts: [{ text: `${systemInstruction}\n\nUSER QUESTION: ${message}` }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
    });

    const replyText = response.text || "I apologize, but I couldn't process your question at this moment. Please try asking in a different way.";
    res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Gemini Chat API error:", error);
    res.status(500).json({
      error: "Failed to answer question via Gemini AI",
      details: error.message || error
    });
  }
});

// Mock User Database for Authentication
interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  institution?: string;
  createdAt: string;
}

const usersDb: StoredUser[] = [
  {
    id: "usr_demo_1",
    name: "Alex Vance",
    email: "alex@example.com",
    passwordHash: "password123",
    institution: "Stanford University",
    createdAt: new Date().toISOString()
  }
];

// API Auth Endpoints
app.post("/api/signup", (req, res) => {
  const { name, email, password, institution } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: "Name, email, and password are required." });
    return;
  }

  const existing = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ success: false, message: "An account with this email already exists." });
    return;
  }

  const newUser: StoredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: password,
    institution: institution?.trim() || "State University",
    createdAt: new Date().toISOString()
  };

  usersDb.push(newUser);

  const { passwordHash, ...userWithoutPassword } = newUser;
  res.json({
    success: true,
    user: userWithoutPassword,
    token: `token_${newUser.id}_${Date.now()}`,
    message: "Account created successfully!"
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password are required." });
    return;
  }

  const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
    res.status(401).json({ success: false, message: "Invalid email or password." });
    return;
  }

  const { passwordHash, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword,
    token: `token_${user.id}_${Date.now()}`,
    message: "Logged in successfully!"
  });
});

app.post("/api/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out successfully." });
});


// Configure Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
