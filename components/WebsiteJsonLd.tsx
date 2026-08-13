import { SITE } from "@/data/site";

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.seoTitle,
    alternateName: ["Immerse the Bay", "StanfordXR"],
    url: SITE.url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
