import { type Question as QuestionType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: string | number) => void;
}

export function Question({ question, onAnswer }: QuestionProps) {
  const [textValue, setTextValue] = useState("");
  const [ratingValue, setRatingValue] = useState(3);

  const handleSubmit = (value: string | number) => {
    onAnswer(value);
    setTextValue("");
    setRatingValue(3);
  };

  switch (question.type) {
    case "multiple_choice":
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{question.text}</h2>
          <RadioGroup
            onValueChange={(value) => handleSubmit(value)}
            className="space-y-4"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case "text":
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{question.text}</h2>
          <div className="space-y-4">
            <Textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[100px]"
            />
            <Button
              onClick={() => handleSubmit(textValue)}
              disabled={!textValue.trim()}
            >
              Next
            </Button>
          </div>
        </div>
      );

    case "rating":
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{question.text}</h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <Slider
                min={1}
                max={5}
                step={1}
                value={[ratingValue]}
                onValueChange={(value) => setRatingValue(value[0])}
                className="w-full"
              />
              <div className="flex justify-between px-2">
                <span className="text-muted-foreground">Poor</span>
                <span className="text-muted-foreground">Excellent</span>
              </div>
            </div>
            <Button onClick={() => handleSubmit(ratingValue)}>Next</Button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
