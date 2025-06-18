"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function initializeAI() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export async function generateCoverLetter(data) {
  if (!data.jobTitle || !data.companyName || !data.jobDescription) {
    throw new Error("Missing required fields: job title, company name, or job description");
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
  
  if (!user.industry || !user.experience || !user.skills || !user.bio) {
    throw new Error("Please complete your profile with industry, experience, skills, and bio information first");
  }

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;
  
  try {
    // Initialize AI model for this request
    const model = await initializeAI().catch(error => {
      console.error("AI initialization error:", error);
      throw new Error("Failed to initialize AI service. Please check your API key.");
    });
    
    // Generate content
    const result = await model.generateContent(prompt).catch(error => {
      console.error("Content generation error:", error);
      throw new Error(error.message || "Failed to generate content");
    });
    
    if (!result) {
      throw new Error("No response received from AI model");
    }

    const response = await result.response;
    if (!response) {
      throw new Error("Empty response from AI model");
    }

    const content = response.text();
    if (!content) {
      throw new Error("No text content in AI response");
    }

    const cleanContent = content.trim();
    if (cleanContent.length === 0) {
      throw new Error("Generated content is empty after cleaning");
    }

    const coverLetter = await db.coverLetter.create({
      data: {
        content: cleanContent,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    }).catch(error => {
      console.error("Database error:", error);
      throw new Error("Failed to save cover letter to database");
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error);
      // Provide more specific error messages
    if (!error) {
      throw new Error("An unknown error occurred");
    }

    // Log the full error for debugging
    console.error("Full error object:", error);

    // Handle different types of errors
    if (error.message?.includes("API key")) {
      throw new Error("AI service configuration error. Please contact support.");
    } else if (error.message?.includes("Missing required fields")) {
      throw new Error(error.message);
    } else if (error.message?.includes("complete your profile")) {
      throw new Error(error.message);
    } else if (error.response?.error?.message) {
      throw new Error(`AI service error: ${error.response.error.message}`);
    } else if (error.code === 'P2002') {
      throw new Error("A cover letter for this job already exists.");
    } else if (error.message) {
      throw new Error(`Cover letter generation failed: ${error.message}`);
    } else {
      // Generic fallback
      throw new Error("Failed to generate cover letter. Please try again.");
    }
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  
  if (!userId) {
      throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
        include: {
            coverLetter: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!user) {
        throw new Error("Onboarding required");
    }

    return user.coverLetter;
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    throw new Error("Failed to fetch cover letters");
  }
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const coverLetter = await db.coverLetter.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  return coverLetter;
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}