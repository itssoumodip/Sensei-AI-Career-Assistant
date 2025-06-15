import { industries } from "@/data/industries"

const OnboardingPage = () => {
  // Check if the user is alredy onboarded

  return (
    <main>
      <OnboardingForm industries={industries}/>
    </main>
  )
}

export default OnboardingPage