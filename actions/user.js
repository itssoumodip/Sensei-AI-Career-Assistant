"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }    try {
        const result = await db.$transaction(
            async (tx) => {
                //find if the industry exists
                let industryInsight = await tx.industryInsight.findUnique({
                    where: {
                        industry: data.industry,
                    }
                })
                //if industry doesnot exist, create it with default values - will replace it with ai leter
                if (!industryInsight) {
                    try {
                        const insights = await generateAIInsights(data.industry);
                        
                        // Validate enum values before creating
                        const validDemandLevels = ["HIGH", "MEDIUM", "LOW"];
                        const validMarketOutlooks = ["POSITIVE", "NEUTRAL", "NEGATIVE"];
                        
                        const demandLevel = validDemandLevels.includes(insights.demandLevel) 
                            ? insights.demandLevel 
                            : "MEDIUM";
                            
                        const marketOutlook = validMarketOutlooks.includes(insights.marketOutlook)
                            ? insights.marketOutlook
                            : "NEUTRAL";
                        
                        industryInsight = await tx.industryInsight.create({
                            data: {
                                industry: data.industry,
                                salaryRanges: insights.salaryRanges || [],
                                growthRate: insights.growthRate || 0,
                                demandLevel: demandLevel,
                                topSkills: insights.topSkills || [],
                                marketOutlook: marketOutlook,
                                keyTrends: insights.keyTrends || [],
                                recommendedSkills: insights.recommendedSkills || [],
                                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            },
                        });
                    } catch (insightError) {
                        console.error("Error generating industry insights:", insightError);
                        
                        // Create with fallback default values if AI generation fails
                        industryInsight = await tx.industryInsight.create({
                            data: {
                                industry: data.industry,
                                salaryRanges: [],
                                growthRate: 0,
                                demandLevel: "MEDIUM",
                                topSkills: [],
                                marketOutlook: "NEUTRAL",
                                keyTrends: [],
                                recommendedSkills: [],
                                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            },
                        });
                    }
                }
                //update the user
                const updateUser = await tx.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    },
                });

                return { updateUser, industryInsight };
            },
            {
                timeout: 10000,
            });

        revalidatePath("/");
        return result.user;
    } catch (error) {
        console.error("Error updating user and industry:", error.message);
        throw new Error("Failed to update profile" + error.message);
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
            select: {
                industry: true,
            }
        })

        return {
            isOnboarded: !!user?.industry,
        };
    } catch (error) {
        console.error("Error fetching user onboarding status:", error.message);
        throw new Error("Failed to fetch onboarding status");
    }
}