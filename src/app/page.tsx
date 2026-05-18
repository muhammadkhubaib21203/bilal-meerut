import Link from "next/link";
import LocalSEOContent from "../components/LocalSEOContent";

const phoneDisplay = "+92 330 5577668";
const phoneLink = "tel:+923305577668";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-gradient-smoke">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Gulshan-e-Maymar, Karachi</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4">
            Bilal Meerut Kabab House
          </h2>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
            Authentic Meerut-style charcoal grilled kababs, tikka, and parathas with bold BBQ flavor.
            Dine in, take away, or order delivery across Gulshan-e-Maymar.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-fire px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              View Menu
            </Link>
            <Link
              href="/order-online"
              className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-primary"
            >
              Order Online
            </Link>
            <a
              href={phoneLink}
              className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-primary"
            >
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-xl text-foreground">Charcoal Grill</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every kabab and tikka is cooked over real charcoal for the signature smoky taste.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-xl text-foreground">Meerut Style</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Classic Meerut kabab recipes made fresh daily with house marinades and spices.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-xl text-foreground">Delivery & Takeaway</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Quick pickup or delivery across Gulshan-e-Maymar and nearby Scheme 45.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LocalSEOContent />
    </main>
  );
}
