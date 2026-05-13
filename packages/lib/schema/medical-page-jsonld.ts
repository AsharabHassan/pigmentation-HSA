interface ReviewerInfo {
  name: string;
  gmcNumber?: string;
  jobTitle?: string;
}

interface MedicalPageParams {
  url: string;
  name: string;
  description: string;
  reviewer: ReviewerInfo;
  lastReviewed: string;
  medicalSpecialty: string;
}

export function buildMedicalPageJsonLd(p: MedicalPageParams) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    url: p.url,
    name: p.name,
    description: p.description,
    inLanguage: "en-GB",
    lastReviewed: p.lastReviewed,
    medicalSpecialty: p.medicalSpecialty,
    reviewedBy: {
      "@type": "Person",
      name: p.reviewer.name,
      jobTitle: p.reviewer.jobTitle ?? "Aesthetic Physician",
      ...(p.reviewer.gmcNumber && {
        identifier: { "@type": "PropertyValue", propertyID: "GMC", value: p.reviewer.gmcNumber },
      }),
    },
    audience: { "@type": "MedicalAudience", audienceType: "Patient" },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem", position: i + 1,
      name: item.name, item: item.url,
    })),
  };
}
