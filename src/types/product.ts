export interface EmiPlan {
  tenureMonths: number;
  interestRate: number;
  cashback: number;
  monthlyAmount: number;
  totalPayable: number;
}

export interface ProductVariant {
  id: string;
  variantLabel: string;
  storage?: string;
  color?: string;
  mrp: number;
  price: number;
  image: string;
  images: string[];
  emiPlans: EmiPlan[];
}

export interface ProductDetails {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  heroImage: string;
  finishes: string[];
  variants: ProductVariant[];
}

export interface ProductSummary {
  slug: string;
  name: string;
  brand: string;
  category: string;
  heroImage: string;
  variantCount: number;
  startingPrice: number;
}
