import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { getProductDetails } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  let product = null;

  try {
    product = await getProductDetails(params.slug);
  } catch (error) {
    console.error(`Failed to load product ${params.slug}:`, error);
  }

  if (!product) notFound();

  return <ProductView product={product} />;
}
