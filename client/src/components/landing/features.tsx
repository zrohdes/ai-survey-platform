import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, BarChart3, QrCode, Clock } from "lucide-react";

const features = [
  {
    title: "AI-Generated Questions",
    description: "Let our AI create relevant and engaging survey questions automatically.",
    icon: BrainCircuit,
  },
  {
    title: "Smart Analytics",
    description: "Get instant insights with AI-powered analysis of survey responses.",
    icon: BarChart3,
  },
  {
    title: "Quick Sharing",
    description: "Share surveys easily with generated QR codes and unique links.",
    icon: QrCode,
  },
  {
    title: "Real-time Results",
    description: "Watch responses and analytics update in real-time as they come in.",
    icon: Clock,
  },
];

export function Features() {
  return (
    <div className="py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to create perfect surveys
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform combines the power of AI with intuitive design to help you
            create, share, and analyze surveys effortlessly.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-24 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f"
            alt="Survey creation process"
            className="rounded-lg shadow-xl max-w-3xl w-full"
          />
        </div>
      </div>
    </div>
  );
}
