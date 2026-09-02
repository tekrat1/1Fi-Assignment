import type { IEmiPlanTemplate } from "@/models/EmiPlanTemplate";

export interface ComputedEmiPlan {
  tenureMonths: number;
  interestRate: number;
  cashback: number;
  monthlyAmount: number;
  totalPayable: number;
}

export function computeEmiPlans(
  price: number,
  templates: Pick<IEmiPlanTemplate, "tenureMonths" | "interestRate" | "cashback">[]
): ComputedEmiPlan[] {
  return templates.map(({ tenureMonths, interestRate, cashback }) => {
    const interest = (price * interestRate * tenureMonths) / (100 * 12);
    const totalPayable = price + interest;

    return {
      tenureMonths,
      interestRate,
      cashback,
      monthlyAmount: Math.round(totalPayable / tenureMonths),
      totalPayable: Math.round(totalPayable),
    };
  });
}
