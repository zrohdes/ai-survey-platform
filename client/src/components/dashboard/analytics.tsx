import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { apiRequest } from "@/lib/queryClient";

interface AnalyticsProps {
  userId?: number;
}

export function Analytics({ userId }: AnalyticsProps) {
  const { data: surveys } = useQuery({
    queryKey: [`/api/users/${userId}/surveys`],
    enabled: !!userId,
  });

  const { data: analysis, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/analysis`],
    enabled: !!surveys?.length,
    queryFn: async () => {
      const responses = await Promise.all(
        surveys.map(async (survey) => {
          const res = await apiRequest(
            "GET",
            `/api/surveys/${survey.id}/responses`,
          );
          return res.json();
        }),
      );

      const analysisRes = await apiRequest("POST", "/api/ai/analyze-responses", {
        responses: responses.flat(),
      });
      return analysisRes.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Create surveys and collect responses to see analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sentimentData = [
    { name: "Positive", value: analysis.sentiment.positive || 0 },
    { name: "Neutral", value: analysis.sentiment.neutral || 0 },
    { name: "Negative", value: analysis.sentiment.negative || 0 },
  ];

  const COLORS = ["#4ade80", "#94a3b8", "#f87171"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {sentimentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Key Trends</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.trends.map((trend: string, i: number) => (
                <li key={i}>{trend}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.recommendations.map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
