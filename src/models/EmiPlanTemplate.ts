import { Schema, model, models } from "mongoose";

export interface IEmiPlanTemplate {
  tenureMonths: number;
  interestRate: number;
  cashback: number;
  order: number;
}

const EmiPlanTemplateSchema = new Schema<IEmiPlanTemplate>(
  {
    tenureMonths: { type: Number, required: true, min: 1 },
    interestRate: { type: Number, required: true, min: 0, default: 0 },
    cashback: { type: Number, required: true, min: 0, default: 0 },
    order: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export default models.EmiPlanTemplate ||
  model<IEmiPlanTemplate>("EmiPlanTemplate", EmiPlanTemplateSchema);
