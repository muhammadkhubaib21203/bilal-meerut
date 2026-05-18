type BreadcrumbItem = {
  name: string;
  item: string;
};

const BreadcrumbJsonLd = ({ items }: { items: BreadcrumbItem[] }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default BreadcrumbJsonLd;
