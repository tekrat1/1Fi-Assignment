import { Schema, models, model } from "mongoose";

// EMI plan templates are tenure/interest/cashback rules stored in the DB.
// The monthly payment amount is computed at request time from a variant's
// price, so nothing about the actual EMI numbers is hardcoded in the app.
export interface IEmiPlanTemplate {
  tenureMonths: number;
  interestRate: number; // annual %, 0 for zero-cost EMI
  cashback: number; // flat cashback amount in INR, 0 if none
  order: number;
}

const EmiPlanTemplateSchema = new Schema<IEmiPlanTemplate>(
  {
    tenureMonths: { type: Number, required: true },
    interestRate: { type: Number, required: true, default: 0 },
    cashback: { type: Number, required: true, default: 0 },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default models.EmiPlanTemplate ||
  model<IEmiPlanTemplate>("EmiPlanTemplate", EmiPlanTemplateSchema);
