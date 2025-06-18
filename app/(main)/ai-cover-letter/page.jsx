import { getCoverLetters } from "@/actions/cover-letter";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  try {
    // First check if user is onboarded
    const { isOnboarded } = await getUserOnboardingStatus();
    if (!isOnboarded) {
      redirect("/onboarding");
    }

    // Then get cover letters
    const coverLetters = await getCoverLetters();

    return (
      <div>
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
          <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
          <Link href="/ai-cover-letter/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </Link>
        </div>

        <CoverLetterList coverLetters={coverLetters || []} />
      </div>
    );
  } catch (error) {
    console.error("Error in CoverLetterPage:", error);
    if (error.message === "Unauthorized") {
      redirect("/sign-in");
    }
    if (error.message === "Onboarding required") {
      redirect("/onboarding");
    }
    throw error;
  }
}