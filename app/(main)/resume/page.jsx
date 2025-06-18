import { getResume } from "@/actions/resume";
import { redirect } from "next/navigation";
import { checkUser } from "@/lib/checkUser";
import ResumeBuilder from "./_components/resume_builder";


export default async function ResumePage() {
  const user = await checkUser();
  
  if (!user) {
    redirect("/onboarding");
  }
  
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}