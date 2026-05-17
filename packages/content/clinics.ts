export type ClinicId = "glasgow" | "london";

export interface Clinic {
  id: ClinicId;
  city: string;
  name: string;
  addressLines: string[];
  postcode: string;
  phoneDisplay: string;
  phoneE164: string;
  mapEmbedSrc: string;
  hours: string;
}

export const clinics: Record<ClinicId, Clinic> = {
  glasgow: {
    id: "glasgow",
    city: "Glasgow",
    name: "Harley Street Aesthetics — Glasgow",
    addressLines: [
      "5th Floor, Ingram House",
      "227 Ingram Street",
      "Glasgow",
    ],
    postcode: "G1 1DA",
    phoneDisplay: "0141 488 8985",
    phoneE164: "+441414888985",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2239.163271483767!2d-4.2558267032104355!3d55.8598336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4888473b07208639%3A0x1ad5dc1b4f68112e!2sHarley%20Street%20Medics!5e0!3m2!1sen!2s!4v1779035868625!5m2!1sen!2s",
    hours: "Mon–Sat · 9am–7pm",
  },
  london: {
    id: "london",
    city: "London",
    name: "Harley Street Aesthetics — London",
    addressLines: [
      "London Medical Rooms",
      "Ground Floor, 1–5 Portpool Lane",
      "Chancery Lane, London",
    ],
    postcode: "EC1N 7UU",
    phoneDisplay: "020 4536 6000",
    phoneE164: "+442045366000",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.577590769762!2d-0.1144842235292171!3d51.5209651718164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b0b8241008f%3A0x81b5e10acd58ba8d!2sHarley%20Street%20Medics!5e0!3m2!1sen!2s!4v1779035835194!5m2!1sen!2s",
    hours: "Mon–Sat · 9am–7pm",
  },
};

export const contactEmail = "hello@harleystreetaesthetic.co.uk";
