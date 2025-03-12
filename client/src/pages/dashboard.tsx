import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SurveyList } from "@/components/dashboard/survey-list";
import { Analytics } from "@/components/dashboard/analytics";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const createSurveySchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  topic: z.string().min(3),
});

export default function Dashboard() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createSurveySchema>>({
    resolver: zodResolver(createSurveySchema),
    defaultValues: {
      title: "",
      description: "",
      topic: "",
    },
  });

  const { data: user } = useQuery({
    queryKey: ["/api/users/1"], // Assuming user 1 for demo
  });

  const createSurveyMutation = useMutation({
    mutationFn: async (values: z.infer<typeof createSurveySchema>) => {
      // First generate questions using AI
      const questionsResponse = await apiRequest("POST", "/api/ai/generate-questions", {
        topic: values.topic,
        numQuestions: 5,
        types: ["multiple_choice", "text", "rating"],
      });
      const questions = await questionsResponse.json();

      // Then create the survey
      return apiRequest("POST", "/api/surveys", {
        title: values.title,
        description: values.description,
        userId: user.id,
        questions,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/1/surveys"] });
      toast({
        title: "Success",
        description: "Survey created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Survey Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Survey</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Survey</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((values) => createSurveyMutation.mutate(values))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic for AI Questions</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Customer Satisfaction" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createSurveyMutation.isPending}>
                  {createSurveyMutation.isPending ? "Creating..." : "Create Survey"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SurveyList userId={user?.id} />
        </div>
        <div>
          <Analytics userId={user?.id} />
        </div>
      </div>
    </div>
  );
}
