import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

// Accept any number that's valid AND not explicitly a landline.
// libphonenumber-js often returns `undefined` or `FIXED_LINE_OR_MOBILE` for documentation/example
// numbers — we treat anything-not-FIXED_LINE as acceptable.
export function normalizePhone(input: string, defaultCountry: CountryCode = "GB"): string | null {
  const parsed = parsePhoneNumberFromString(input, defaultCountry);
  if (!parsed || !parsed.isValid()) return null;
  const type = parsed.getType();
  if (type === "FIXED_LINE") return null;
  return parsed.number;
}

export function isValidMobile(input: string, defaultCountry: CountryCode = "GB"): boolean {
  return normalizePhone(input, defaultCountry) !== null;
}
