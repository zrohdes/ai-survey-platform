import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
    </div>
  );
}
