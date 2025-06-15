"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Label } from "@/components/ui/label";
import { ArrowDownNarrowWide, ChevronDown, Search } from "lucide-react";

const OnboardingForm = ({ industries }) => {

  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  })

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 font-extrabold tracking-tighter text-transparent bg-clip-text pb-2 pr-2 text-4xl">Complete Your Profile</CardTitle>
          <CardDescription>Select your industry to get personalized carrer insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry" className="w-full mt-2 p-2 border-card-foreground border rounded-md">
                  <span className="flex justify-between px-3">
                    <SelectValue placeholder="Select an industry" />
                    <ChevronDown />
                  </span>
                </SelectTrigger>
                <SelectContent className="h-full gap-3 p-4 m-4 bg-card overflow-y-auto mt-1">
                  {industries.map((ind) => {
                    return <SelectItem value={ind.id} key={ind.id}>{ind.name}</SelectItem>
                  })}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subIndustry">Specialization</Label>
              <Select
                onValueChange={(value) => {
                  setValue("subIndustry", value);
                }}
              >
                <SelectTrigger id="subIndustry" className="w-full mt-2 p-2 border-card-foreground border rounded-md">
                  <span className="flex justify-between px-3">
                    <SelectValue placeholder="Select an industry" />
                    <ChevronDown />
                  </span>
                </SelectTrigger>
                <SelectContent className="h-full gap-3 p-4 m-4 bg-card overflow-y-auto mt-1">
                  {selectedIndustry?.subIndustries.map((ind) => {
                    return <SelectItem value={ind} key={ind}>{ind}</SelectItem>
                  })}
                </SelectContent>
              </Select>
              {errors.subIndustry && (
                <p className="text-sm text-red-500">
                  {errors.subIndustry.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default OnboardingForm;