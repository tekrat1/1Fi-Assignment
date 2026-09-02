"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#F8F7F3]">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-widest text-ink/40">Something went wrong</p>
        <h1 className="font-display text-3xl text-ink mt-3">We couldn&apos;t load the store.</h1>
        <p className="text-ink/60 mt-3">
          Please try again. If the problem continues, check the production database configuration.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-ink px-5 py-3 text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
