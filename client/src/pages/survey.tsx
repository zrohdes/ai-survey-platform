import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Question } from "@/components/survey/question";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { type Answer } from "@shared/schema";

export default function Survey() {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const { data: survey, isLoading } = useQuery({
    queryKey: [`/api/surveys/${id}`],
  });

  const submitResponseMutation = useMutation({
    mutationFn: async (answers: Answer[]) => {
      return apiRequest("POST", `/api/surveys/${id}/responses`, {
        surveyId: Number(id),
        answers,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thank you for completing the survey!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers, { questionId: currentQuestion, value: answer }];
    setAnswers(newAnswers);

    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitResponseMutation.mutate(newAnswers);
    }
  };

  const progress = ((currentQuestion + 1) / survey.questions.length) * 100;

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>
          <p className="text-muted-foreground mb-6">{survey.description}</p>

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Question {currentQuestion + 1} of {survey.questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {survey.questions[currentQuestion] && (
            <Question
              question={survey.questions[currentQuestion]}
              onAnswer={handleAnswer}
            />
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion === survey.questions.length - 1 && (
              <Button
                onClick={() => submitResponseMutation.mutate(answers)}
                disabled={submitResponseMutation.isPending}
              >
                {submitResponseMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
