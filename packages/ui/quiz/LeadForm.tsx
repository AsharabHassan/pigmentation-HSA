"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../primitives/Input";
import type { QuizAnswers } from "./state";

interface FormFields {
  fullName: string;
  email: string;
  phone: string;
  phoneCountry: string;
  consent: boolean;
  marketingConsent: boolean;
}

export interface RevealPayload {
  firstName: string;
  concern: string | null;
  fitzpatrick: string | null;
  recommendedProtocol: string | null;
  estimatedSessions: string | null;
  tag: "lead-hot" | "lead-warm" | "lead-cold";
}

interface Props {
  answers: QuizAnswers;
  onReveal: (data: RevealPayload) => void;
  source?: string;
}

interface Utm {
  utm_source: string | null; utm_medium: string | null;
  utm_campaign: string | null; utm_term: string | null;
  gclid: string | null; fbclid: string | null;
  landing_page_url: string | null; referrer: string | null;
}

function readUtm(): Utm {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null,
             gclid: null, fbclid: null, landing_page_url: null, referrer: null };
  }
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:       p.get("utm_source"),
    utm_medium:       p.get("utm_medium"),
    utm_campaign:     p.get("utm_campaign"),
    utm_term:         p.get("utm_term"),
    gclid:            p.get("gclid"),
    fbclid:           p.get("fbclid"),
    landing_page_url: window.location.href,
    referrer:         document.referrer || null,
  };
}

export function LeadForm({ answers, onReveal, source = "lp-pigmentation" }: Props) {
  const { register, handleSubmit, formState: { isValid, isSubmitting }, setError, watch } =
    useForm<FormFields>({
      mode: "onChange",
      defaultValues: { phoneCountry: "GB", consent: false, marketingConsent: false },
    });
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const onSubmit = async (form: FormFields) => {
    setServerErrors({});
    const utm = readUtm();
    const res = await fetch("/api/lead/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        rawPhone: form.phone,
        phoneCountry: form.phoneCountry,
        consent: form.consent,
        marketingConsent: form.marketingConsent,
        source,
        quiz: answers,
        utm,
      }),
    });

    const data = await res.json() as
      | { ok: true; reveal: RevealPayload }
      | { ok: false; fieldErrors?: Record<string, string>; error?: string };

    if (!res.ok || !data.ok) {
      const errs = ("fieldErrors" in data && data.fieldErrors) || {};
      setServerErrors(errs);
      for (const [field, msg] of Object.entries(errs)) {
        setError(field as keyof FormFields, { type: "server", message: msg });
      }
      return;
    }

    onReveal(data.reveal);
  };

  const consentChecked = watch("consent");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md mx-auto">
      <h3 className="font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900">
        Your personalised plan is ready.
      </h3>
      <p className="mt-3 text-ink-700">
        A clinician will review and reach out within 1 working day with your tailored protocol.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <Input
          id="fullName" label="Full name *"
          autoComplete="name"
          error={serverErrors.fullName}
          {...register("fullName", { required: true, minLength: 2 })}
        />
        <Input
          id="email" label="Email *" type="email"
          autoComplete="email"
          error={serverErrors.email}
          {...register("email", { required: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ })}
        />

        <div className="grid grid-cols-[100px_1fr] gap-3">
          <div>
            <label htmlFor="phoneCountry" className="block text-xs uppercase tracking-[0.12em] text-gold-500 mb-2">
              Country
            </label>
            <select id="phoneCountry"
              className="w-full bg-ivory-200 border border-ink-300 px-3 py-3 text-base text-ink-900
                         focus:border-gold-500 outline-none"
              {...register("phoneCountry")}>
              <option value="GB">🇬🇧 +44</option>
              <option value="IE">🇮🇪 +353</option>
              <option value="US">🇺🇸 +1</option>
              <option value="AE">🇦🇪 +971</option>
              <option value="PK">🇵🇰 +92</option>
              <option value="IN">🇮🇳 +91</option>
            </select>
          </div>
          <Input
            id="phone" label="Mobile *" type="tel" autoComplete="tel"
            helpText="We'll send your plan + booking link by SMS"
            error={serverErrors.phone}
            {...register("phone", { required: true, minLength: 7 })}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-ink-700 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-gold-500"
                 {...register("consent", { required: true })} />
          <span>I consent to be contacted about my plan by the clinic. <span className="text-error-500">*</span></span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink-700 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-gold-500"
                 {...register("marketingConsent")} />
          <span>Send me occasional skincare tips and offers. (Optional)</span>
        </label>

        <button
          type="submit"
          disabled={!isValid || !consentChecked || isSubmitting}
          className="mt-2 bg-ink-900 text-ivory-50 px-7 py-4 text-sm uppercase tracking-wider
                     ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-50
                     hover:bg-aubergine-900 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending…" : "Reveal My Plan →"}
        </button>

        <p className="text-xs text-ink-500 mt-1">
          🔒 Encrypted. We never share your data. GDPR-compliant.
        </p>
      </div>
    </form>
  );
}
