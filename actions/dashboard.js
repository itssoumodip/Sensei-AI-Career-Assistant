"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

export const generateAIInsights = async (industry) => {
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    const data = JSON.parse(cleanedText);
    
    // Convert values to match Prisma enum formats
    if (data.demandLevel) {
        // Map "High", "Medium", "Low" to "HIGH", "MEDIUM", "LOW"
        const demandLevelMap = {
            "High": "HIGH",
            "Medium": "MEDIUM", 
            "Low": "LOW"
        };
        data.demandLevel = demandLevelMap[data.demandLevel] || "MEDIUM";
    }
    
    if (data.marketOutlook) {
        // Map "Positive", "Neutral", "Negative" to "POSITIVE", "NEUTRAL", "NEGATIVE"
        const marketOutlookMap = {
            "Positive": "POSITIVE",
            "Neutral": "NEUTRAL",
            "Negative": "NEGATIVE"
        };
        data.marketOutlook = marketOutlookMap[data.marketOutlook] || "NEUTRAL";
    }

    return data;
};

export async function getIndustryInsights() {
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
        include: {
            industryInsight: true,
        },
    });

    if (!user) {
        // If user doesn't exist in our database, they need to complete onboarding
        throw new Error("Onboarding required");
    }

    if (!user.industry) {
        // If user exists but doesn't have an industry set, they need to complete onboarding
        throw new Error("Onboarding required");
    }

    if (!user.industryInsight) {
        const insights = await generateAIInsights(user.industry);

        const industryInsight = await db.industryInsight.create({
            data: {
                industry: user.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
            },
        });
        return industryInsight;
    }

    return user.industryInsight;
}