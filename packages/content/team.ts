import type { DoctorProfile } from "@ui/sections/DoctorSection";

/**
 * Single source of truth for the Harley Street Aesthetics clinical team.
 * Each LP imports this and reorders so the specialism-matched doctor
 * is presented first, but every team member appears on every page.
 */

export const drAyda: DoctorProfile = {
  name: "Dr. Ayda Soltanzadeh",
  credentials: "Cosmetic Consultant · Primary Care Dermatology · 15+ yrs",
  portrait: "/images/doctor/ayda.webp",
  portraitAlt: "Dr. Ayda Soltanzadeh, Cosmetic Consultant at Harley Street Aesthetics",
  philosophy:
    "Pigmentation is rarely just skin-deep — and the treatment shouldn't be either.",
  yearsOfPractice: 15,
  bio:
    "15+ years in aesthetic medicine and primary care dermatology. Most of the patients I see have tried everything before they walk through the door — what they actually need is the right protocol, calibrated to their skin type.",
};

export const mrAlNakib: DoctorProfile = {
  name: "Mr. Khalil Al-Nakib",
  credentials: "Consultant Plastic Surgeon · FRCS (Ed) · FRCS (G) · MBChB",
  portrait: "/images/doctor/dr-khalil.webp",
  portraitAlt: "Mr. Khalil Al-Nakib, Consultant Plastic Surgeon at Harley Street Aesthetics",
  philosophy:
    "A peel isn't a punishment — it's a precision tool. Right grade, right intervals, right aftercare.",
  yearsOfPractice: 45,
  bio:
    "Consultant Plastic Surgeon and Fellow of the Royal College of Surgeons (Edinburgh & Glasgow). Treats 500+ patients a year. Specialisms include medical-grade peels, laser, facial injectables, and reconstructive procedures.",
};

/** Default team ordering (alphabetical-by-firstname). Pages reorder per specialism. */
export const team: DoctorProfile[] = [drAyda, mrAlNakib];
