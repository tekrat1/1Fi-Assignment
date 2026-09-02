import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fairway — Buy now, pay in EMIs backed by mutual funds",
  description: "Shop smartphones on flexible EMI plans backed by mutual funds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen">
        <header className="border-b border-line">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <a href="/" className="font-display text-xl tracking-tight text-ink">
              Fairway
            </a>
            <span className="text-sm text-ink/60">
              EMIs backed by mutual funds
            </span>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-line mt-24">
          <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-ink/50">
            1Fi SDE1 Assignment — demo store, not a real product.
          </div>
        </footer>
      </body>
    </html>
  );
}
