import {
  APPLICATIONS_OPEN_DATE,
  EVENT_IMAGE_PATHS,
  PORTAL_APPLY_BASE_URL,
  SITE,
} from "@/data/site";

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
        image: EVENT_IMAGE_PATHS.map((path) => `${SITE.url}${path}`),
        startDate: "2026-11-13",
        endDate: "2026-11-15",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "Stanford University",
          address: {
            "@type": "PostalAddress",
            streetAddress: "450 Jane Stanford Way",
            addressLocality: "Stanford",
            addressRegion: "CA",
            postalCode: "94305",
            addressCountry: "US",
          },
        },
        organizer: {
          "@id": `${SITE.url}/#organization`,
          "@type": "Organization",
          name: SITE.organizationName,
          url: SITE.website,
        },
        // Stanford XR both runs the hackathon and hosts the workshops and demo
        // fair, so it is the performing group as well as the organizer.
        performer: {
          "@type": "PerformingGroup",
          name: SITE.organizationName,
          url: SITE.website,
        },
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          name: "Hacker registration",
          description: "Free to attend for accepted applicants.",
          url: PORTAL_APPLY_BASE_URL,
          price: 0,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          validFrom: APPLICATIONS_OPEN_DATE,
        },
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
