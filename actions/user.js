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

    // Validate required fields
    if (!data.industry) {
        throw new Error("Industry is required");
    }

    if (typeof data.experience !== 'number') {
        throw new Error("Years of experience must be a number");
    }

    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // First, ensure the industry insight exists
        const insights = await generateAIInsights(data.industry);
        
        // Create or update industry insights first
        await db.industryInsight.upsert({
            where: {
                industry: data.industry,
            },
            update: {
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
                industry: data.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // Now update the user after industry insight is created
        const updatedUser = await db.user.update({
            where: {
                id: user.id
            },
            data: {
                industry: data.industry,
                experience: data.experience,
                skills: Array.isArray(data.skills) ? data.skills : [],
                bio: data.bio || null
            }
        });

        revalidatePath("/dashboard");
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error(error.message || "Failed to update profile");
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

    // If user doesn't exist in our database yet, they need onboarding
    if (!user) {
        return { isOnboarded: false };
    }

    // If user exists but doesn't have required fields, they need onboarding
    const isOnboarded = Boolean(
        user.industry && 
        user.experience
    );

    return { isOnboarded };
}