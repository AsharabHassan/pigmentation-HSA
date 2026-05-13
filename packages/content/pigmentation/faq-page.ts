import type { FaqEntry } from "@lib/schema/faq-jsonld";

export interface FaqGroup {
  heading: string;
  intro?: string;
  entries: FaqEntry[];
}

export const faqGroups: FaqGroup[] = [
  {
    heading: "The Basics",
    entries: [
      { question: "What is pigmentation?",
        answer: "Pigmentation refers to the colour of your skin, produced by melanin. When melanin is produced unevenly or in excess in a localized area, it creates visible dark patches, spots, or zones — what most people mean when they say they 'have pigmentation.' It's one of the most common skin concerns globally." },
      { question: "What causes pigmentation?",
        answer: "The four most common triggers are UV exposure (sun damage), hormonal changes (pregnancy, contraception, HRT — driving melasma), post-inflammatory pigmentation (left by acne, eczema, or injury), and genetics. Less common causes include certain medications, thyroid conditions, and Addison's disease — which we screen for during consultation when relevant." },
      { question: "Hyperpigmentation vs melasma vs PIH — what's the difference?",
        answer: "Hyperpigmentation is the umbrella term for any area of skin darker than the surrounding tone. Melasma is a specific subtype — symmetrical, hormonal, sits deeper in the skin. Post-inflammatory hyperpigmentation (PIH) is the dark mark left after acne or injury heals. Each responds to slightly different protocols, which is why diagnosis matters." },
      { question: "Why do some people get pigmentation more than others?",
        answer: "Three factors: skin type (Fitzpatrick IV–VI naturally produce more melanin and are more reactive), hormone profile (estrogen-related conditions drive melasma), and sun exposure history. Fitzpatrick III–VI with hormonal pigmentation triggers are the most affected demographic — and the most challenging to treat without proper protocol calibration." },
      { question: "Is pigmentation hereditary?",
        answer: "Predisposition is hereditary — particularly for melasma. If your mother or sister has melasma, you are statistically more likely to develop it. But hereditary predisposition only matters when triggered by hormones or UV, both of which are partially controllable." },
      { question: "Does pigmentation go away on its own?",
        answer: "Superficial post-inflammatory pigmentation can fade over months to a year without treatment, but only if the trigger (e.g., active acne) is resolved. Sun damage and melasma do not resolve on their own — they tend to worsen over time as the underlying cause continues. This is the most common reason patients eventually seek treatment after years of waiting." },
      { question: "Can stress cause pigmentation?",
        answer: "Indirectly. Chronic stress raises cortisol, which can disrupt hormonal balance and exacerbate melasma. Stress also tends to drive habits — poor sleep, neglecting SPF, picking at skin — that worsen any existing pigmentation. We can't treat your stress, but we can address its visible consequences." },
    ],
  },
  {
    heading: "Types of Pigmentation We Treat",
    entries: [
      { question: "Melasma (chloasma) — treatment, causes, why it recurs",
        answer: "Melasma is hormonally driven pigmentation that typically appears symmetrically on the cheeks, forehead, and upper lip. It's most common in women aged 25–50 and in Fitzpatrick III–V skin. Topical creams alone clear approximately 30% of cases because they don't reach the dermal layer where melasma melanocytes live. Our protocol combines pulsed-mode laser (to fragment dermal pigment) with mesotherapy infusion (to slow re-pigmentation). Recurrence is common during pregnancy or hormone changes — managed with quarterly maintenance peels." },
      { question: "Sun damage / solar lentigines / age spots",
        answer: "These appear as small, well-defined brown spots on areas of cumulative UV exposure — face, hands, chest, shoulders. They sit at the epidermal level, which makes them more responsive to treatment than melasma. Most cases clear in 2–4 PicoSure or Q-switched laser sessions. Daily SPF 50+ thereafter is critical to prevent recurrence." },
      { question: "Post-inflammatory hyperpigmentation (acne marks)",
        answer: "PIH appears as flat dark spots where active acne lesions previously sat. It's not scarring — it's pigment, and it's treatable. The protocol is typically pulsed laser combined with a series of light chemical peels. Critically: active acne must be controlled first, or PIH will keep regenerating faster than it clears." },
      { question: "Lip pigmentation / dark lips",
        answer: "Dark lips have a range of causes — sun exposure, smoking, vitamin deficiency, certain medications, or genetic predisposition. Our lip neutralisation protocol uses pulsed laser at lower energy settings (lips are more sensitive than facial skin) over 3–4 sessions, with a custom mesotherapy infusion to support healing. Results typically hold for years with avoidance of the original trigger." },
      { question: "Underarm and body pigmentation",
        answer: "Underarm and inguinal pigmentation are typically caused by friction, hair-removal trauma, deodorant chemistry, or hormonal factors. The protocol is similar to facial pigmentation but delivered at modified energy settings appropriate for thinner, more sensitive skin in these areas. Usually 4–6 sessions, paired with prescription topical maintenance." },
      { question: "Freckles — removal vs preservation",
        answer: "Freckles are pigment, and they can be removed with the same protocols. Whether you should remove them is your call — many patients choose to remove sun damage but preserve freckles. We can discuss what's appropriate for your aesthetic goal at consultation." },
      { question: "Café-au-lait marks",
        answer: "Café-au-lait macules are congenital pigmented patches. They're benign in most cases but can be cosmetically distressing. Treatment is challenging — they often respond partially to pulsed laser and may require more sessions than other pigmentation types. We can give you a realistic prognosis at consultation." },
    ],
  },
  {
    heading: "Our Treatments",
    entries: [
      { question: "The Signature 3-Step Protocol (VirtueRF + Exosome + Mesotherapy)",
        answer: "Our flagship pigmentation protocol. Step 1: VirtueRF radiofrequency microneedling opens precision microchannels through the epidermis without thermal damage to surrounding tissue. Step 2: Pulsed-mode laser delivers energy at the dermal layer where pigment lives, fragmenting it without inflammation. Step 3: Exosome therapy + a custom mesotherapy cocktail (Vitamin C, Glutathione, tranexamic acid, growth factors) is infused through the channels — accelerating pigment clearance and slowing future melanin production. £399 per session, typically 4–6 sessions." },
      { question: "PicoSure laser for pigmentation",
        answer: "Picosecond-pulsed laser delivers energy in trillionths of a second — fast enough to fragment pigment without heating tissue. We use it for sun damage, post-acne pigmentation, and melasma in Fitzpatrick III–V. It's the same family of laser used for tattoo removal, which gives you a sense of how effectively it shatters pigment." },
      { question: "Chemical peels for pigmentation",
        answer: "Our medical peels are tiered: glycolic + vitamin C for surface tone; salicylic for acne-driven pigmentation; TCA for deeper marks. We use peels both as a standalone for milder pigmentation and as a maintenance step alongside the 3-step protocol. £149–£299 depending on tier. Typically same-day, no downtime." },
      { question: "Glutathione IV drip — when it helps, when it doesn't",
        answer: "Glutathione is a powerful antioxidant that, intravenously, can slow melanin production system-wide and brighten overall skin tone. It works best as a complement to laser treatment, not a replacement. Patients with localized pigmentation see more dramatic results from targeted laser; patients seeking overall brightness benefit most from the drip. Most patients combine both." },
      { question: "Topical prescriptions (hydroquinone, tretinoin, kojic acid)",
        answer: "Prescription topicals — hydroquinone 4%, tretinoin 0.025–0.1%, kojic acid combinations — can be effective for surface-level pigmentation as a standalone treatment, particularly for PIH. They plateau around 30% improvement for deeper pigmentation like melasma. We prescribe them as a maintenance regime after the in-clinic protocol or as a starter for early-stage cases." },
    ],
  },
  {
    heading: "Safety, Skin Type & Suitability",
    entries: [
      { question: "Treating darker skin tones safely (Fitzpatrick IV-VI)",
        answer: "Darker skin requires calibrated protocols. The two risks are rebound pigmentation (skin darkens after treatment) and depigmentation (skin loses pigment in treated areas). We mitigate both through pulsed-mode technology (no thermal damage), reduced energy settings, longer between-session intervals, and pre-treatment with topical preparation. Many of our patients are Fitzpatrick V–VI and routinely complete the full protocol safely." },
      { question: "Pregnancy, breastfeeding, and medications",
        answer: "We do not perform laser pigmentation treatment during pregnancy or while breastfeeding. Melasma often worsens during pregnancy regardless of treatment — and the hormonal trigger keeps re-firing. We're happy to consult and prepare a post-pregnancy plan. Certain medications (Accutane, photosensitizing antibiotics) also require waiting periods before treatment, which we screen for." },
      { question: "Conditions that disqualify treatment",
        answer: "Active skin infections, uncontrolled eczema or psoriasis in the treatment area, recent isotretinoin use (Accutane within 6 months), pacemakers (for RF treatments), keloid history (for needling), and certain auto-immune conditions. We screen for these at consultation and either modify the protocol or refer appropriately." },
      { question: "Is it safe for sensitive skin?",
        answer: "Yes — but the protocol is modified. Sensitive skin types start with a patch test, lower energy settings, and longer intervals. We may also incorporate calming actives into the mesotherapy infusion. Sensitive skin is rarely a disqualifier; it just requires a more conservative approach." },
    ],
  },
  {
    heading: "Cost, Booking & Aftercare",
    entries: [
      { question: "Pricing transparency — every protocol, no hidden fees",
        answer: "Initial consultation: free. Clarity Peel (standalone): £149–£299 depending on tier. Signature 3-Step Pigmentation Protocol: £399 per session, typically 4–6 sessions (£1,596–£2,394 total). PicoSure single session: £299. Glutathione IV drip: £159 per session. We provide a full written breakdown at consultation. We do not charge for follow-up reviews." },
      { question: "Finance, Klarna, payment plans",
        answer: "Klarna is available for any single session over £150 (split into 3 interest-free payments). For the full protocol, we offer in-house split-payment plans over 3, 6, or 12 months — interest-free for qualifying plans. Approval is typically same-day at consultation." },
      { question: "Aftercare schedule — Day 1 to Week 12",
        answer: "Day 1: ice if needed, no makeup, gentle cleanser only. Days 2–7: SPF 50+ minimum every 2 hours when outdoors, prescription topical applied evenings. Weeks 2–4: pigment may temporarily darken before clearing — this is expected. Week 4: session 2. Weeks 5–9: continued protocol + at-home regime. Week 12: review + maintenance plan. We send the full written schedule by SMS + email after consultation." },
      { question: "Sunscreen — ingredients to look for, ingredients to avoid",
        answer: "We recommend mineral SPF (zinc oxide or titanium dioxide) at SPF 50+, applied every 2 hours when outdoors. Tinted mineral SPF is ideal — the tint adds visible-light protection, which matters for melasma. Avoid alcohol-heavy sunscreens during the protocol (they can sensitize healing skin). We stock our preferred brands at the clinic." },
      { question: "Do you treat international clients?",
        answer: "Yes — we see a steady flow of patients from London, Manchester, Birmingham, and overseas (UAE, Pakistan, Ireland, US). The full protocol can be condensed into 3–4 visits across 12 weeks, with virtual follow-ups in between. We can recommend nearby accommodation and arrange consecutive-day scheduling." },
      { question: "Can I combine pigmentation treatment with other procedures?",
        answer: "Yes — and many patients do. Pigmentation protocol pairs naturally with skin tightening, fine-line treatment, and the glow drip. We sequence them to avoid overstressing the skin — usually pigmentation first, then complementary procedures from week 8 onwards. Your consultation will map out a combined plan if relevant." },
    ],
  },
];

export const faqPageFlat: FaqEntry[] = faqGroups.flatMap(g => g.entries);
