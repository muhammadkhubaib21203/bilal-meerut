const baseUrl = "https://www.bilalmeerutkababhouse.com";

const canonicalHeader = (path) => `<${baseUrl}${path}>; rel=\"canonical\"`;

const config = {
  compress: true,
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Link", value: canonicalHeader("/") },
        ],
      },
      {
        source: "/menu",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Link", value: canonicalHeader("/menu") },
        ],
      },
      {
        source: "/about",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Link", value: canonicalHeader("/about") },
        ],
      },
      {
        source: "/contact",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Link", value: canonicalHeader("/contact") },
        ],
      },
      {
        source: "/order-online",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Link", value: canonicalHeader("/order-online") },
        ],
      },
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
    ];
  },
};

export default config;
