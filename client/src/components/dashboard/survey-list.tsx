import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "wouter";
import { Survey } from "@shared/schema";
import { AlertTriangle, BarChart, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SurveyCardProps {
  survey: Survey;
}

function SurveyCard({ survey }: SurveyCardProps) {
  const surveyUrl = `${window.location.origin}/survey/${survey.id}`;

  const { data: responses } = useQuery({
    queryKey: [`/api/surveys/${survey.id}/responses`],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Link href={`/survey/${survey.id}`} className="hover:text-primary">
            {survey.title}
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Survey</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <QRCodeSVG value={surveyUrl} size={200} />
                <input
                  type="text"
                  value={surveyUrl}
                  readOnly
                  className="w-full p-2 bg-muted rounded"
                  onClick={(e) => e.currentTarget.select()}
                />
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{survey.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>{responses?.length || 0} responses</span>
          </div>
          {(!responses || responses.length === 0) && (
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              <span>No responses yet</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface SurveyListProps {
  userId?: number;
}

export function SurveyList({ userId }: SurveyListProps) {
  const { data: surveys, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/surveys`],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!surveys?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No surveys created yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {surveys.map((survey) => (
        <SurveyCard key={survey.id} survey={survey} />
      ))}
    </div>
  );
}
