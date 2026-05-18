import Link from "next/link";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";

const baseUrl = "https://www.bilalmeerutkababhouse.com";

const menuHighlights = [
  {
    title: "Meerut-Style Kababs",
    description: "Seekh kabab, chapli kabab, and grilled favorites marinated in classic Meerut spices.",
  },
  {
    title: "Tikka & BBQ Platters",
    description: "Charcoal grilled tikka, wings, and BBQ platters perfect for sharing.",
  },
  {
    title: "Paratha & Rolls",
    description: "Fresh paratha rolls with kabab, sauces, and crunchy sides.",
  },
];

export default function MenuPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Menu", item: `${baseUrl}/menu` },
        ]}
      />
      <main className="min-h-screen bg-background text-foreground">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">Menu</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Explore BBQ, kababs, tikka, and paratha rolls made fresh daily in Gulshan-e-Maymar.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {menuHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-display text-xl text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/order-online"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-fire px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Order Online
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-primary"
              >
                Visit Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
