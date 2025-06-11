import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Personalized Onboarding",
    description: "Tell us about your background and goals to tailor your career journey.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Build Your Career Toolkit",
    description: "Generate powerful, ATS-friendly resumes and standout cover letters effortlessly.",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Master Your Interviews",
    description: "Practice with AI-simulated interviews and get instant, role-specific feedback.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Measure Your Growth",
    description: "Track your performance and progress with smart analytics and insights.",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
