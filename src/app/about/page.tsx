import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";

const baseUrl = "https://www.bilalmeerutkababhouse.com";

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "About", item: `${baseUrl}/about` },
        ]}
      />
      <main className="min-h-screen bg-background text-foreground">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">About Bilal Meerut Kabab House</h1>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              Bilal Meerut Kabab House brings authentic Meerut-style charcoal kababs to Gulshan-e-Maymar,
              Karachi. Our kitchen focuses on bold BBQ flavor, fresh marinades, and slow charcoal grilling
              that keeps every kabab juicy and smoky.
            </p>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              Whether you are dining in with family, picking up a takeaway, or ordering delivery, we keep
              the experience simple and flavorful with classic tikka, seekh kabab, and paratha rolls.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
