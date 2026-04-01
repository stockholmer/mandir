export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HinduTemple",
    name: "Hindu Mandir Society Stockholm",
    alternateName: "Helenelund Hindu Mandir",
    description:
      "Hindu Mandir Society Stockholm — A place for prayer, community, and Indian culture in Helenelund, Stockholm, Sweden.",
    url: "https://www.mandirstockholm.com",
    telephone: "08-35 72 22",
    email: "helenalundhindumandir@gmail.com",
    image: "https://www.mandirstockholm.com/images/temple/Mandir_Photo.jpeg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Åkervägen 1",
      addressLocality: "Helenelund",
      addressRegion: "Stockholm",
      postalCode: "191 40",
      addressCountry: "SE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 59.3835,
      longitude: 17.9476,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "09:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "17:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "11:00",
        closes: "16:00",
      },
    ],
    // TODO: Add verified social media URLs when available (e.g., Facebook, YouTube, Instagram)
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
