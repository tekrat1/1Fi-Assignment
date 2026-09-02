import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/baseUrl";
import ProductView from "@/components/ProductView";

async function getProduct(slug: string) {
  const res = await fetch(`${getBaseUrl()}/api/products/${slug}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load product");
  const data = await res.json();
  return data.product;
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return <ProductView product={product} />;
}
