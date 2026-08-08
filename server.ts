import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Dynamic Gemini API client instantiation
let aiClient: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

function getGeminiClient(): GoogleGenAI | null {
  dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or holds the placeholder value. Falling back to high-quality template-based generator.");
    aiClient = null;
    currentApiKey = null;
    return null;
  }
  if (!aiClient || currentApiKey !== apiKey) {
    currentApiKey = apiKey;
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
        id: "cert_free_1",
        title: "Responsive Web Design & Modern Frontend Certification",
        providerOrPlatform: "freeCodeCamp",
        description: "Comprehensive 300-hour hands-on certification covering HTML5, CSS3, Flexbox, CSS Grid, and responsive UI principles.",
        link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
        difficultyOrTime: "4 weeks (Self-Paced)",
        skillsAcquired: ["Responsive Web Design", "HTML5 & CSS3", "Flexbox & Grid", "UI Design"],
        actionLabel: "Start Free Certification",
        isPaid: false,
        priceInfo: "Free"
      },
      {
        id: "cert_free_2",
        title: `Foundational ${cleanedMajor} & Software Engineering Principles`,
        providerOrPlatform: "Meta / Coursera (Free Audit)",
        description: `Explore core computational concepts, clean code standards, and modern development workflows tailored for ${cleanedGoals} roles.`,
        link: "https://www.coursera.org",
        difficultyOrTime: "3-4 weeks",
        skillsAcquired: ["Software Principles", "Version Control", "Algorithmic Thinking"],
        actionLabel: "Audit For Free",
        isPaid: false,
        priceInfo: "Free"
      },
      {
        id: "cert_free_3",
        title: "AWS Cloud Quest & Cloud Practitioner Foundations",
        providerOrPlatform: "AWS Skill Builder",
        description: "Interactive role-based learning game and practical cloud fundamentals certification offered directly by Amazon Web Services.",
        link: "https://aws.amazon.com/training/digital/",
        difficultyOrTime: "2-3 weeks",
        skillsAcquired: ["Cloud Computing", "AWS Core Services", "Infrastructure Fundamentals"],
        actionLabel: "Start AWS Free Track",
        isPaid: false,
        priceInfo: "Free"
      },
      {
        id: "cert_paid_1",
        title: `Professional Certificate in Advanced ${cleanedMajor} Concepts`,
        providerOrPlatform: "Coursera (Google / IBM)",
        description: `A highly regarded professional credential designed to solidify core engineering practices for ${cleanedGoals} positions.`,
        link: "https://www.coursera.org",
        difficultyOrTime: "6-8 weeks",
        skillsAcquired: ["Advanced Architecture", "Industry Best Practices", "Software Lifecycle"],
        actionLabel: "Explore Paid Course",
        isPaid: true,
        priceInfo: "Paid Certificate"
      },
      {
        id: "cert_paid_2",
        title: "AWS Certified Developer / Cloud Architect Associate",
        providerOrPlatform: "Amazon Web Services (AWS)",
        description: "Industry-standard certification validating technical expertise in building and deploying cloud applications on AWS.",
        link: "https://aws.amazon.com/certification/",
        difficultyOrTime: "2-3 months",
        skillsAcquired: ["AWS Services", "Serverless Architecture", "Cloud Security"],
        actionLabel: "View Exam Guide",
        isPaid: true,
        priceInfo: "Paid Exam ($150)"
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
app.post(["/api/generate-idp", "/generate-idp"], async (req, res) => {
  let reqMajor = "Computer Science";
  let reqSkills = "Software Engineering";
  let reqGoals = "Software Developer";
  let reqLevel = "intermediate";
  let reqCommitment = "10 hours/week";

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    reqMajor = body.major || reqMajor;
    reqSkills = body.skills || reqSkills;
    reqGoals = body.goals || reqGoals;
    reqLevel = body.experienceLevel || reqLevel;
    reqCommitment = body.timeCommitment || reqCommitment;

    const ai = getGeminiClient();

    if (!ai) {
      const fallback = generateFallbackIDP(reqMajor, reqSkills, reqGoals, reqLevel, reqCommitment);
      res.json(fallback);
      return;
    }

    // Prepare prompt
    const prompt = `You are a professional career coach and education consultant. Generate a highly personalized Individual Development Plan (IDP) for a student with the following profile:
- Major/Specialization: ${reqMajor}
- Current Skills: ${reqSkills}
- Career Goals/Target Roles: ${reqGoals}
- Experience Level: ${reqLevel}
- Weekly Time Commitment: ${reqCommitment}

For the certifications field, provide a mix of highly relevant free certification courses (e.g. from freeCodeCamp, edX free audit, Coursera free audit, Kaggle) and premier paid/professional certifications (e.g. AWS Certified, Coursera/Meta professional certificates, Oracle, Cisco). Ensure you label each certification's cost status accurately.
Provide extremely realistic, concrete, actionable, and state-of-the-art recommendations. Do not use generic placeholders.
Your response MUST be fully populated, highly relevant to their target goals, and match the specified JSON schema exactly.`;

    const systemInstruction = `You are an elite AI Career Advisory System. Your task is to output a comprehensive and highly specific Individual Development Plan (IDP) in valid JSON format.
Ensure that each list of items has exactly 2 to 4 high-quality, practical entries. For certifications, make sure to classify whether it is paid (isPaid: true, priceInfo: e.g. "Paid Certificate") or free (isPaid: false, priceInfo: "Free"). Give exact course names, popular platforms, github projects, and real interview advice customized for this specific student.`;

    const modelsToTry = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-lite-latest"];
    let response: any = null;
    let lastErr: any = null;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API call timed out after 7 seconds")), 7000)
    );

    for (const m of modelsToTry) {
      try {
        const apiCall = ai.models.generateContent({
          model: m,
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
                  description: "Target job titles.",
                },
                certifications: {
                  type: Type.ARRAY,
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
                      isPaid: { type: Type.BOOLEAN },
                      priceInfo: { type: Type.STRING }
                    },
                    required: ["id", "title", "providerOrPlatform", "description", "link", "difficultyOrTime", "skillsAcquired", "actionLabel", "isPaid", "priceInfo"]
                  }
                },
                projects: {
                  type: Type.ARRAY,
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
                    required: ["id", "title", "providerOrPlatform", "description", "link", "difficultyOrTime", "skillsAcquired", "actionLabel"]
                  }
                },
                codingPractice: {
                  type: Type.ARRAY,
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
                    required: ["id", "title", "providerOrPlatform", "description", "link", "difficultyOrTime", "skillsAcquired", "actionLabel"]
                  }
                },
                aptitudePractice: {
                  type: Type.ARRAY,
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
                    required: ["id", "title", "providerOrPlatform", "description", "link", "difficultyOrTime", "skillsAcquired", "actionLabel"]
                  }
                },
                softSkills: {
                  type: Type.ARRAY,
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
                    required: ["id", "title", "providerOrPlatform", "description", "link", "difficultyOrTime", "skillsAcquired", "actionLabel"]
                  }
                },
                resumeImprovements: {
                  type: Type.ARRAY,
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
                    required: ["id", "title", "providerOrPlatform", "description", "link", "difficultyOrTime", "skillsAcquired", "actionLabel"]
                  }
                },
                interviewPrep: {
                  type: Type.ARRAY,
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
                    required: ["id", "title", "providerOrPlatform", "description", "link", "difficultyOrTime", "skillsAcquired", "actionLabel"]
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

        response = await Promise.race([apiCall, timeoutPromise]);
        if (response && response.text) break;
      } catch (e: any) {
        lastErr = e;
      }
    }

    if (response && response.text) {
      const resultJson = JSON.parse(response.text.trim());
      res.json({
        ...resultJson,
        isMock: false
      });
    } else {
      console.warn("Gemini API call failed across models, using intelligent fallback generator:", lastErr?.message || lastErr);
      const fallback = generateFallbackIDP(reqMajor, reqSkills, reqGoals, reqLevel, reqCommitment);
      res.json(fallback);
    }
  } catch (error: any) {
    console.warn("Gemini outer error, using intelligent fallback generator:", error?.message || error);
    const fallback = generateFallbackIDP(reqMajor, reqSkills, reqGoals, reqLevel, reqCommitment);
    res.json(fallback);
  }
});

// Helper function for generating intelligent fallback chat responses
function getFallbackChatAnswer(message: string, studentProfile: any, idp: any): string {
  const majorStr = studentProfile?.major || "Computer Science & Engineering";
  const goalsStr = studentProfile?.goals || "Technology Specialist";
  const msgTrimmed = message.trim();
  const msgLower = msgTrimmed.toLowerCase();

  // Hardware, Embedded & Semiconductor domain questions
  if (/\b(hardware|chip|semiconductor|vlsi|embedded|robotics|fpga|microcontroller|risc|circuit|npu|gpu|tpu|pcb)\b/i.test(msgLower)) {
    return `### 🚀 Most Popular & Future-Proof Hardware Engineering Fields

Based on current industry demand and emerging technologies, here are the top hardware domains for future growth:

1. **AI Acceleration & Custom Silicon Design (NPU/GPU/TPU)**
   - Designing specialized tensor-processing microarchitectures for AI inference and model training (NVIDIA, Apple Neural Engine, Google TPU, Tenstorrent).
   - High demand for **Verilog / SystemVerilog**, **RISC-V**, and **ASIC design**.

2. **Semiconductor & Advanced VLSI Engineering**
   - High-density chiplet architecture, 3D IC stacking, and sub-2nm node development.
   - Essential skills: VLSI layout, physical design synthesis, static timing analysis (STA).

3. **Embedded Systems, TinyML & Edge Devices**
   - Running lightweight neural networks on microcontrollers (STM32, ESP32, ARM Cortex-M).
   - Critical for smart devices, automotive ECUs, and medical IoT devices.

4. **Robotics & Autonomous Systems Hardware**
   - Motor controllers, sensor fusion (LiDAR, Radar, Cameras), and real-time processing units for drones and autonomous vehicles.

5. **Quantum Hardware & Photonics Engineering**
   - Superconducting qubits, optical interconnects, and silicon photonics for next-gen datacenter throughput.

*Tip for **${majorStr}** students:* Combining hardware knowledge (C/C++, Verilog, SystemC) with software proficiency (Python, CUDA, PyTorch) makes you an exceptionally high-value candidate in tech!`;
  }

  // Greetings check (word boundary prevents matching "which", "machine", "white", etc.)
  if (/^\s*(hi|hello|hey|greetings|howdy|good morning|good afternoon|good evening)\b/i.test(msgLower)) {
    return `Hello! 👋 I'm your **Gemini AI Career & IDP Assistant**. 

I have loaded your IDP profile for **${majorStr}** targeting **${goalsStr}**. 

How can I help you today? You can ask me about:
- **Hardware & Software career trends**
- **Recommended free vs paid certifications**
- **GitHub portfolio project ideas**
- **Interview preparation & resume tips**`;
  }

  // Certifications
  if (msgLower.includes("certif") || msgLower.includes("course")) {
    return `Regarding certifications for **${goalsStr}**:\n\nWe recommend starting with free, high-impact foundational certificates (such as freeCodeCamp, Meta/Coursera free audit, or AWS Skill Builder) before enrolling in paid credentials. Check out the curated **Certifications** section in your plan dashboard for direct links!`;
  }

  // Projects & GitHub
  if (msgLower.includes("project") || msgLower.includes("github") || msgLower.includes("build") || msgLower.includes("portfolio")) {
    return `For building a standout portfolio in **${goalsStr}**:\n\nFocus on building 2-3 end-to-end projects demonstrating your skills in ${studentProfile?.skills || "your primary stack"}. Ensure each GitHub repository includes detailed setup documentation, clean architecture, and a live hosted demo link!`;
  }

  // Interview & Resume
  if (msgLower.includes("interview") || msgLower.includes("resume") || msgLower.includes("prep") || msgLower.includes("cv")) {
    return `For interview and resume preparation:\n\nUse the **STAR framework** (Situation, Task, Action, Result) for behavioral questions and highlight quantified impact (e.g., *"Optimized API latency by 35% using Redis caching"*) on your resume. Check your dashboard's **Interview Prep** panel for mock interview platforms!`;
  }

  // Default intelligent response referencing user's prompt
  return `Regarding your question about **"${msgTrimmed}"**:\n\nBased on your **${majorStr}** profile targeting **${goalsStr}**, maintaining consistent progress is key. Ensure you follow your weekly study commitment of **${studentProfile?.timeCommitment || "10 hours/week"}** and explore the customized project and certification tracks on your IDP dashboard!`;
}

// API Route for Floating IDP AI Assistant Chat
app.post(["/api/chat-idp", "/chat-idp"], async (req, res) => {
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
      const fallbackAnswer = getFallbackChatAnswer(message, studentProfile, idp);
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

    const modelsToTry = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-lite-latest"];
    let response: any = null;
    let lastErr: any = null;

    for (const m of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: m,
          contents: contents,
        });
        if (response && response.text) break;
      } catch (e: any) {
        lastErr = e;
      }
    }

    if (response && response.text) {
      res.json({ reply: response.text });
    } else {
      console.warn("Gemini Chat API call failed across models, using fallback answer:", lastErr?.message || lastErr);
      const fallbackAnswer = getFallbackChatAnswer(message, studentProfile, idp);
      res.json({ reply: fallbackAnswer });
    }

  } catch (error: any) {
    console.error("Gemini Chat API error:", error);
    const fallbackAnswer = getFallbackChatAnswer(req.body?.message || "", req.body?.studentProfile, req.body?.idp);
    res.json({ reply: fallbackAnswer });
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
    id: "usr_demo_123",
    name: "Alex Dev",
    email: "alex@example.com",
    passwordHash: "password123",
    institution: "Computer Science University",
    createdAt: new Date().toISOString()
  }
];

// API Auth Endpoints
app.post(["/api/signup", "/signup", "/api/register", "/register"], (req, res) => {
  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const { name, email, password, institution } = body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Name, email, and password are required." });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = usersDb.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, message: "An account with this email already exists." });
      return;
    }

    const newUser: StoredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: password,
      institution: institution?.trim() || "University Student",
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Failed to process registration request." });
  }
});

app.post(["/api/login", "/login"], (req, res) => {
  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const { email, password } = body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required." });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = usersDb.find(u => u.email.toLowerCase() === cleanEmail);
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Failed to process login request." });
  }
});

app.post(["/api/logout", "/logout"], (_req, res) => {
  res.json({ success: true, message: "Logged out successfully." });
});


// Configure Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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

if (!process.env.VERCEL) {
  startServer();
}

export default app;
