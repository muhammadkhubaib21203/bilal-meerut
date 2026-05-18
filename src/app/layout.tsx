import type { Metadata } from "next";
import "../index.css";

const baseUrl = "https://www.bilalmeerutkababhouse.com";

const description =
  "BBQ & kababs with tikka, charcoal grilled Meerut-style flavors in Gulshan-e-Maymar, Karachi. Dine-in, takeaway, delivery.";

const keywords = [
  "Bilal Meerut Kabab House",
  "Bilal Meerut Kabab",
  "Meerut kabab Karachi",
  "Meerut style kabab",
  "Meerut kabab house Karachi",
  "BBQ in Gulshan-e-Maymar",
  "BBQ Gulshan e Maymar",
  "best BBQ in Gulshan-e-Maymar",
  "kabab house Gulshan-e-Maymar",
  "kabab house Gulshan e Maymar",
  "restaurants in Gulshan-e-Maymar",
  "best restaurant Gulshan-e-Maymar",
  "BBQ near me Gulshan-e-Maymar Karachi",
  "charcoal grill Gulshan-e-Maymar",
  "tikka in Gulshan-e-Maymar",
  "seekh kabab Gulshan-e-Maymar",
  "paratha roll Gulshan-e-Maymar",
  "BBQ delivery Gulshan-e-Maymar",
  "food delivery Gulshan-e-Maymar",
  "Gulshan-e-Maymar BBQ Karachi",
  "Pakistani BBQ Karachi",
  "Mughlai BBQ Karachi",
  "Gulshan-e-Maymar mein BBQ",
  "Gulshan e Maymar mein kabab",
  "kabab ghar Gulshan-e-Maymar",
  "Meerut kabab Gulshan e Maymar",
];

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Restaurant", "LocalBusiness", "FoodEstablishment"],
  name: "Bilal Meerut Kabab House",
  url: `${baseUrl}/`,
  image: [
    `${baseUrl}/assets/hero-bbq-CZkvRZn8.jpg`,
    `${baseUrl}/logo.png`,
  ],
  telephone: "+92 330 5577668",
  priceRange: "$$",
  servesCuisine: ["Pakistani", "BBQ", "Mughlai", "Meerut Kabab"],
  hasMenu: `${baseUrl}/menu`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Main Nawaz Sharif Park, X 4th St, Sector X",
    addressLocality: "Gulshan-e-Maymar",
    addressRegion: "Sindh",
    postalCode: "75340",
    addressCountry: "PK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.0216392,
    longitude: 67.1274399,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "17:00",
      closes: "03:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 200,
  },
  sameAs: [
    "https://www.google.com/maps/search/?api=1&query=Bilal+Meerut+Famous+Kabab+Paratha+Main+Nawaz+Sharif+Park+Karachi",
    "https://www.facebook.com/officialbilalmeerut/",
    "https://www.instagram.com/officialbilalmeerut?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  ],
  areaServed: ["Gulshan-e-Maymar", "Karachi", "Scheme 45"],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Bilal Meerut Kabab House | Best BBQ & Kababs in Gulshan-e-Maymar, Karachi",
  description,
  keywords,
  alternates: {
    canonical: `${baseUrl}/`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Bilal Meerut Kabab House | Best BBQ & Kababs in Gulshan-e-Maymar, Karachi",
    description,
    url: `${baseUrl}/`,
    siteName: "Bilal Meerut Kabab House",
    locale: "en_PK",
    type: "restaurant",
    images: [
      { url: `${baseUrl}/assets/hero-bbq-CZkvRZn8.jpg` },
      { url: `${baseUrl}/logo.png` },
    ],
  } as Metadata["openGraph"],
  twitter: {
    card: "summary_large_image",
    title: "Bilal Meerut Kabab House | Best BBQ & Kababs in Gulshan-e-Maymar, Karachi",
    description,
    images: [`${baseUrl}/assets/hero-bbq-CZkvRZn8.jpg`],
  },
  verification: {
    google: "PASTE_YOUR_CODE_HERE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK">
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
