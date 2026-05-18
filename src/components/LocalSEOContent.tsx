const phoneDisplay = "+92 330 5577668";
const phoneLink = "tel:+923305577668";

const LocalSEOContent = () => {
  return (
    <section className="border-t border-border/60 bg-background/70">
      <div className="container mx-auto px-4 py-12 text-sm text-muted-foreground">
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-4">
          Best BBQ & Kabab House in Gulshan-e-Maymar, Karachi
        </h1>

        <h2 className="font-display text-xl text-foreground mt-6">
          Authentic Meerut-Style Charcoal Kababs
        </h2>
        <p className="mt-3 leading-relaxed">
          Bilal Meerut Kabab House is a local favorite in Gulshan-e-Maymar, Karachi, serving BBQ, kabab,
          tikka, and paratha cooked on a charcoal grill. Dine in with family, grab takeaway on the go,
          or order delivery across Gulshan-e-Maymar and nearby Scheme 45 for Meerut style flavor from a
          best restaurant trusted by BBQ lovers.
        </p>

        <h2 className="font-display text-xl text-foreground mt-6">
          Dine-In & Takeaway in Gulshan-e-Maymar
        </h2>
        <p className="mt-3 leading-relaxed">
          Enjoy smoky kababs fresh off the charcoal grill in a relaxed dine-in space, or pick up a quick
          takeaway on your way home. Every order keeps the classic Meerut kabab taste front and center.
        </p>

        <h2 className="font-display text-xl text-foreground mt-6">
          Our Location & Hours
        </h2>
        <div
          className="mt-4 rounded-2xl bg-secondary/40 p-5 text-foreground"
          itemScope
          itemType="https://schema.org/Restaurant"
        >
          <meta itemProp="name" content="Bilal Meerut Kabab House" />
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <p className="font-medium" itemProp="streetAddress">
              Main Nawaz Sharif Park, X 4th St, Sector X
            </p>
            <p className="text-sm text-muted-foreground">
              <span itemProp="addressLocality">Gulshan-e-Maymar</span>, Karachi,
              <span itemProp="addressRegion"> Sindh</span>,
              <span itemProp="postalCode"> 75340</span>,
              <span itemProp="addressCountry"> PK</span>
            </p>
          </div>
          <div className="mt-3 flex flex-col gap-1 text-sm">
            <a itemProp="telephone" href={phoneLink} className="text-primary hover:underline">
              {phoneDisplay}
            </a>
            <span itemProp="openingHours">Open daily 5:00 PM to 3:00 AM</span>
            <a
              itemProp="url"
              href="https://www.bilalmeerutkababhouse.com/"
              className="text-primary hover:underline"
            >
              https://www.bilalmeerutkababhouse.com/
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalSEOContent;
