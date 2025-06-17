import React from 'react'
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import { notFound } from "next/navigation";
import CoverLetterPreview from "../_components/cover-letter-preview";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CoverLetter = async ({params}) => {
    const id = await params.id
    const coverLetter = await getCoverLetter(id);

    if (!coverLetter) {
      notFound();
    }

    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-2">
          <Link href="/ai-cover-letter">
            <Button variant="link" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Cover Letters
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {coverLetter.jobTitle} at {coverLetter.companyName}
                  </CardTitle>
                  <CardDescription>
                    Created on{" "}
                    {format(new Date(coverLetter.createdAt), "MMM d, yyyy")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CoverLetterPreview content={coverLetter.content} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
}

export default CoverLetter