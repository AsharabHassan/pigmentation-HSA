import type { Testimonial } from "@ui/sections/Testimonials";

export const testimonialsGlasgow: Testimonial[] = [
  {
    firstName: "Aisha", city: "Glasgow", stars: 5,
    quote: "Ten years of melasma and three clinics later — this was the first place that explained why the creams weren't working before they sold me anything. Three sessions in and the patches have genuinely lifted. No rebound at my six-month review either.",
    beforeSrc: "/images/testimonials/aisha-before.png",
    afterSrc:  "/images/testimonials/aisha-after.png",
  },
  {
    firstName: "Chris", city: "Glasgow", stars: 5,
    quote: "Sun-damage spots on my cheeks that I'd been told were just permanent. Faded over three sessions. The whole team made it feel like proper medicine — not a beauty appointment.",
    beforeSrc: "/images/testimonials/chris-before.png",
    afterSrc:  "/images/testimonials/chris-after.png",
  },
  {
    firstName: "Mairi", city: "Edinburgh", stars: 5,
    quote: "Years of post-acne marks on my cheeks that foundation couldn't quite hide. Worth the drive from Edinburgh — the consult alone told me more than my GP ever had. By week twelve my skin looked even for the first time in a decade.",
    beforeSrc: "/images/testimonials/lena-before.png",
    afterSrc:  "/images/testimonials/lena-after.png",
  },
  {
    firstName: "Yusuf", city: "Glasgow", stars: 5,
    quote: "I'm Fitzpatrick V and most clinics either refused to treat me or used something too aggressive last time and left a worse mark. Here the protocol was actually calibrated to my skin type. Visible difference by session two with zero burning.",
    beforeSrc: "/images/testimonials/anika-before.png",
    afterSrc:  "/images/testimonials/anika-after.png",
  },
  {
    firstName: "Eilidh", city: "Stirling", stars: 5,
    quote: "Pregnancy left me with melasma that no over-the-counter cream touched. Started treatment six months after the baby and by month three my forehead was clear. Felt looked-after through the whole protocol.",
    beforeSrc: "/images/testimonials/mehmet-before.png",
    afterSrc:  "/images/testimonials/mehmet-after.png",
  },
  {
    firstName: "Ravi", city: "Glasgow", stars: 5,
    quote: "Chest pigmentation from years on a building site — everywhere else just wanted to laser my face. Here they took the chest seriously, mapped the whole area, and four sessions later the difference is the kind I actually wanted to show people.",
    beforeSrc: "/images/testimonials/yasmin-before.png",
    afterSrc:  "/images/testimonials/yasmin-after.png",
  },
];

export const testimonialsLondon: Testimonial[] = [
  {
    firstName: "Sofia", city: "Hackney", stars: 5,
    quote: "Melasma after my second pregnancy — three places in central London told me it would 'just settle' on its own. It didn't. Three sessions here and it's the lightest it's been in two years. The honesty about realistic timeframes was the part I appreciated.",
    beforeSrc: "/images/testimonials/aisha-before.png",
    afterSrc:  "/images/testimonials/aisha-after.png",
  },
  {
    firstName: "James", city: "Wimbledon", stars: 5,
    quote: "Sun spots from years of running outdoors. Wedding in seven months and a fiancée who'd been hinting. Three sessions and a proper SPF routine — clear by the engagement shoot. No nonsense, no upsells.",
    beforeSrc: "/images/testimonials/chris-before.png",
    afterSrc:  "/images/testimonials/chris-after.png",
  },
  {
    firstName: "Priya", city: "Croydon", stars: 5,
    quote: "Post-inflammatory marks from teenage acne that had haunted my twenties. South Asian skin, so most clinics warned me off. Here the protocol was built around my skin type from the first consult. The marks evened out by month four.",
    beforeSrc: "/images/testimonials/lena-before.png",
    afterSrc:  "/images/testimonials/lena-after.png",
  },
  {
    firstName: "Anika", city: "London", stars: 5,
    quote: "Booked twelve weeks before my wedding. Uneven tone across my forehead that I'd given up on. The team paced the protocol so my skin had time to recover — no risk of being mid-flake on the day. Visible glow by session three.",
    beforeSrc: "/images/testimonials/anika-before.png",
    afterSrc:  "/images/testimonials/anika-after.png",
  },
  {
    firstName: "Mehmet", city: "London", stars: 5,
    quote: "Patchy pigmentation across both cheeks from years working in the sun back home. Was sceptical anything would actually shift it. Genuinely lifted by session two — the photos at month three convinced me.",
    beforeSrc: "/images/testimonials/mehmet-before.png",
    afterSrc:  "/images/testimonials/mehmet-after.png",
  },
  {
    firstName: "Yasmin", city: "Kingston", stars: 5,
    quote: "Hormonal melasma that started when I went on the pill and got worse every summer. Other clinics kept selling me hydroquinone with no real plan. Here it was a proper protocol with checkpoints. Holding clear at the six-month review.",
    beforeSrc: "/images/testimonials/yasmin-before.png",
    afterSrc:  "/images/testimonials/yasmin-after.png",
  },
];

// Default export — kept for back-compat where a single list is wanted.
export const testimonials: Testimonial[] = testimonialsGlasgow;
