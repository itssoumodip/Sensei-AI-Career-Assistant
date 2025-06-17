import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
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
            <CardTitle>Cover Letter Not Found</CardTitle>
            <CardDescription>
              The cover letter you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai-cover-letter/new">
              <Button>Create New Cover Letter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}