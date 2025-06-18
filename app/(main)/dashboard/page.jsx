import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
  try {
    // First check if the user is onboarded
    const { isOnboarded } = await getUserOnboardingStatus();
    if (!isOnboarded) {
      redirect("/onboarding");
    }

    // Now try to get insights
    const insights = await getIndustryInsights();
    
    return (
      <div className="container mx-auto">
        <DashboardView insights={insights} />
      </div>
    );
  } catch (error) {
    if (error.message === "Unauthorized") {
      redirect("/sign-in");
    }
    if (error.message === "Onboarding required") {
      redirect("/onboarding");
    }
    throw error; // For any other unexpected errors
  }
}

export default IndustryInsightsPage;