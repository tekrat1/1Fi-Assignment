export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center">
      <h1 className="font-display text-2xl text-ink">Product not found</h1>
      <p className="mt-2 text-ink/60">
        We couldn&apos;t find that product.{" "}
        <a href="/" className="text-clay underline">
          Back to all products
        </a>
      </p>
    </div>
  );
}
