import Link from "next/link";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";

const baseUrl = "https://www.bilalmeerutkababhouse.com";
const phoneDisplay = "+92 330 5577668";
const phoneLink = "tel:+923305577668";

export default function OrderOnlinePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Order Online", item: `${baseUrl}/order-online` },
        ]}
      />
      <main className="min-h-screen bg-background text-foreground">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">Order Online</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Enjoy Meerut-style BBQ, kababs, and tikka at home with delivery across Gulshan-e-Maymar and
              nearby Scheme 45. Choose pickup or delivery and we will prepare your order fresh.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-xl text-foreground">1. Browse the Menu</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pick your BBQ favorites, kababs, paratha rolls, and charcoal grilled platters.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-xl text-foreground">2. Choose Delivery or Pickup</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We serve Gulshan-e-Maymar and nearby areas with fast delivery and easy takeaway.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-xl text-foreground">3. Confirm Your Order</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Place your order online or call us directly for bulk or special requests.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-fire px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                View Menu
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
      </main>
    </>
  );
}
