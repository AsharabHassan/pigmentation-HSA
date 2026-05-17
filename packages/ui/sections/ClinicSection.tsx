import { Container } from "../primitives/Container";
import { contactEmail, type Clinic } from "@content/clinics";

interface Props {
  clinic: Clinic;
}

export function ClinicSection({ clinic }: Props) {
  const fullAddress = `${clinic.addressLines.join(" ")} ${clinic.postcode}`;
  return (
    <section id="find-us" className="bg-surface-50 py-20 md:py-28">
      <Container width="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05]">
              Find us in {clinic.city}
            </h2>
            <div className="mt-10 space-y-5 text-base md:text-lg text-ink-900 leading-relaxed">
              <p>
                <span className="font-semibold">Address:</span>{" "}
                <span className="text-ink-700">{fullAddress}</span>
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a
                  href={`tel:${clinic.phoneE164}`}
                  className="text-clay-500 hover:text-clay-600 transition-colors"
                >
                  {clinic.phoneDisplay}
                </a>
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-clay-500 hover:text-clay-600 transition-colors"
                >
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-surface-200 aspect-[4/3] md:aspect-[5/4]">
            <iframe
              src={clinic.mapEmbedSrc}
              title={`${clinic.name} — map`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
