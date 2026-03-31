import { CostCalculatorClient } from "@/components/costs/cost-calculator-client";

export default function CostsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <CostCalculatorClient />
      </div>
    </main>
  );
}
