import { SITE } from "@/data/site";

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.seoTitle,
        alternateName: ["Immerse the Bay", SITE.organizationName],
        url: SITE.url,
        description: SITE.seoDescription,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.organizationName,
        url: SITE.website,
        sameAs: [
          "https://www.instagram.com/stanford_xr/",
          "https://linkedin.com/company/stanfordxr",
        ],
      },
      {
        "@type": "Event",
        "@id": `${SITE.url}/#event`,
        name: SITE.name,
        description: SITE.seoDescription,
        startDate: "2026-11-13",
        endDate: "2026-11-15",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "Stanford University",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Stanford",
            addressRegion: "CA",
            addressCountry: "US",
          },
        },
        organizer: { "@id": `${SITE.url}/#organization` },
        url: SITE.url,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
