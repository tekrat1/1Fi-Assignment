"use client";

import { formatINR } from "@/lib/format";
import type { EmiPlan } from "@/types/product";

interface EmiPlanListProps {
  plans: EmiPlan[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function EmiPlanList({
  plans,
  selectedIndex,
  onSelect,
}: EmiPlanListProps) {
  return (
    <div className="space-y-2">
      {plans.map((plan, index) => (
        <label
          key={`${plan.tenureMonths}-${plan.interestRate}`}
          className={`flex items-center justify-between gap-4 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
            index === selectedIndex
              ? "border-ink bg-ink/[0.03]"
              : "border-line hover:border-ink/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="emi-plan"
              checked={index === selectedIndex}
              onChange={() => onSelect(index)}
              className="accent-ink"
            />
            <div>
              <p className="text-sm text-ink">
                {formatINR(plan.monthlyAmount)} x {plan.tenureMonths} months
              </p>
              {plan.cashback > 0 && (
                <p className="text-xs text-moss mt-0.5">
                  Additional cashback of {formatINR(plan.cashback)}
                </p>
              )}
            </div>
          </div>
          <span className="text-xs text-ink/50 whitespace-nowrap">
            {plan.interestRate > 0 ? `${plan.interestRate}% interest` : "0% interest"}
          </span>
        </label>
      ))}
    </div>
  );
}
