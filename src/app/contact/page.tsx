import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";

const baseUrl = "https://www.bilalmeerutkababhouse.com";
const phoneDisplay = "+92 330 5577668";
const phoneLink = "tel:+923305577668";
const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=Bilal+Meerut+Famous+Kabab+Paratha+Main+Nawaz+Sharif+Park+Karachi";

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Contact", item: `${baseUrl}/contact` },
        ]}
      />
      <main className="min-h-screen bg-background text-foreground">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">Contact & Location</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Visit us in Gulshan-e-Maymar, Karachi for fresh BBQ, kababs, and tikka cooked on charcoal.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-xl text-foreground">Address</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Main Nawaz Sharif Park, X 4th St, Sector X, Gulshan-e-Maymar, Karachi, 75340, Pakistan
                </p>
                <a
                  href={mapUrl}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-xl text-foreground">Hours & Phone</h2>
                <p className="mt-2 text-sm text-muted-foreground">Open daily 5:00 PM to 3:00 AM</p>
                <a
                  href={phoneLink}
                  className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:underline"
                >
                  {phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
