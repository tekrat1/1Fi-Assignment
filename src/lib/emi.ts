export interface EmiPlanTemplateLite {
  tenureMonths: number;
  interestRate: number;
  cashback: number;
}

export interface ComputedEmiPlan {
  tenureMonths: number;
  interestRate: number;
  cashback: number;
  monthlyAmount: number;
  totalPayable: number;
}

/**
 * Simple-interest EMI calculation:
 * totalPayable = price + price * (interestRate/100) * (tenureMonths/12)
 * monthlyAmount = totalPayable / tenureMonths
 * Rounded to the nearest rupee, same convention lenders use for display.
 */
export function computeEmiPlans(
  price: number,
  templates: EmiPlanTemplateLite[]
): ComputedEmiPlan[] {
  return templates.map((t) => {
    const totalPayable = price + (price * t.interestRate * t.tenureMonths) / (100 * 12);
    const monthlyAmount = Math.round(totalPayable / t.tenureMonths);
    return {
      tenureMonths: t.tenureMonths,
      interestRate: t.interestRate,
      cashback: t.cashback,
      monthlyAmount,
      totalPayable: Math.round(totalPayable),
    };
  });
}
