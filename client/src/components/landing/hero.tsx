import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export function Hero() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("POST", "/api/users", { email });
      toast({
        title: "Success!",
        description: "You've been added to the waitlist.",
      });
      setEmail("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Create AI-Powered Surveys
            <span className="text-primary"> in Seconds</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Transform your feedback collection with intelligent surveys. Let AI generate
            meaningful questions and analyze responses automatically.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex gap-x-4 w-full max-w-md">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <img
          src="https://images.unsplash.com/photo-1524114051012-0a2aa8dae4e1"
          alt="Dashboard illustration"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
