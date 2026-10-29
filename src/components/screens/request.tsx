import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, ScreenContainer, Segmented, Stepper } from "../ios";
import { occasions, occasionById, talentBySlug, talents } from "../../lib/content";
import { haptic } from "../../lib/haptics";
import { useApp, type AccountType } from "../../lib/store";
import { cn } from "../../lib/utils";

type Draft = {
  eventType: string;
  date: string;
  time: string;
  hours: number;
  guests: number;
  setting: "indoor" | "outdoor";
  venue: string;
  city: string;
  talentSlugs: string[];
  notes: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  accountType: AccountType;
};

const steps = ["Event", "When & where", "Talent", "Your details", "Review"];

function readPrefill() {
  if (typeof sessionStorage === "undefined") return { event: "", talent: "" };
  const raw = sessionStorage.getItem("rjr-prefill");
  if (!raw) return { event: "", talent: "" };
  try {
    const parsed = JSON.parse(raw) as { event?: string; talent?: string };
    return { event: parsed.event ?? "", talent: parsed.talent ?? "" };
  } catch {
    return { event: "", talent: "" };
  }
}

export function RequestScreen() {
  const { user, addRequest, pushToast, hydrated } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ reference: string; id: string } | null>(null);
  const [draft, setDraft] = useState<Draft>({
    eventType: "",
    date: "",
    time: "18:00",
    hours: 3,
    guests: 80,
    setting: "indoor",
    venue: "",
    city: "Winter Garden",
    talentSlugs: [],
    notes: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    accountType: "individual",
  });

  const seeded = useRef(false);
  useEffect(() => {
    if (!hydrated || seeded.current) return;
    seeded.current = true;
    const prefill = readPrefill();
    setDraft((current) => ({
      ...current,
      eventType: occasionById(prefill.event)?.label || current.eventType,
      talentSlugs: prefill.talent ? [prefill.talent] : current.talentSlugs,
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company: user?.company || "",
      accountType: user?.accountType || "individual",
    }));
  }, [hydrated, user]);

  const prefilled = useMemo(() => {
    if (!hydrated) return draft;
    return {
      ...draft,
      name: draft.name || user?.fullName || "",
      email: draft.email || user?.email || "",
      phone: draft.phone || user?.phone || "",
      company: draft.company || user?.company || "",
      accountType: draft.accountType || user?.accountType || "individual",
    };
  }, [draft, hydrated, user]);

  const patch = (partial: Partial<Draft>) => setDraft((current) => ({ ...current, ...partial }));

  const next = () => {
    if (step < steps.length - 1) {
      if (step === 3) {
        patch({
          name: prefilled.name,
          email: prefilled.email,
          phone: prefilled.phone,
          company: prefilled.company,
          accountType: prefilled.accountType,
        });
      }
      setStep(step + 1);
      haptic("tap");
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      const created = addRequest({
        eventType: draft.eventType,
        date: draft.date,
        time: draft.time,
        hours: draft.hours,
        guests: draft.guests,
        setting: draft.setting,
        venue: draft.venue.trim(),
        city: draft.city.trim(),
        talents: draft.talentSlugs.map((slug) => talentBySlug(slug)?.title ?? slug),
        notes: draft.notes.trim(),
        name: prefilled.name.trim(),
        email: prefilled.email.trim(),
        phone: prefilled.phone.trim(),
        company: prefilled.accountType === "business" ? prefilled.company.trim() : undefined,
      });
      haptic("success");
      pushToast("Request sent", created.reference);
      setDone({ reference: created.reference, id: created.id });
      setSending(false);
    }, 700);
  };

  if (done) {
    return (
      <ScreenContainer tab>
        <div style={{ height: "env(safe-area-inset-top, 0px)" }} />
        <div className="px-4 pt-8 text-center">
          <div className="animate-check mx-auto grid size-20 place-items-center rounded-full bg-success text-4xl text-white">
            ✓
          </div>
          <h1 className="mt-5 text-[34px] font-bold leading-tight">Request sent</h1>
          <p className="mt-2 text-[17px] leading-relaxed text-secondary-text">
            Reference {done.reference}. Our team will follow up about your{" "}
            {draft.eventType.toLowerCase()}.
          </p>
          <div className="mt-8 space-y-3">
            <Button onClick={() => navigate({ to: "/requests/$id", params: { id: done.id } })}>
              View Request
            </Button>
            <Button variant="secondary" onClick={() => navigate({ to: "/home" })}>
              Back to Home
            </Button>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer tab>
      <header data-chrome className="z-30 shrink-0 bg-black text-white">
        <div className="status-bar" />
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                className="flex min-h-11 items-center text-[17px] font-medium text-white"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            ) : (
              <span className="text-[13px] font-semibold uppercase tracking-wide text-white/70">
                Request
              </span>
            )}
            <p className="text-[13px] font-semibold text-white/70">
              Step {step + 1} of {steps.length}
            </p>
          </div>
          <div className="mt-3 h-1 bg-white/25">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <h1 className="mt-3 text-[28px] font-bold leading-none tracking-tight">
            {steps[step] ?? "Request"}
          </h1>
          <p className="mt-1.5 text-[13px] text-white/70">Request a Talent</p>
        </div>
      </header>
      <div className="space-y-4 px-4 pt-4">
        {step === 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {occasions.map((occasion) => {
              const selected = draft.eventType === occasion.label;
              return (
                <button
                  key={occasion.id}
                  type="button"
                  onClick={() => patch({ eventType: occasion.label })}
                  className={cn(
                    "min-h-[72px] rounded-[16px] px-3 py-3 text-left",
                    selected
                      ? "bg-primary text-white"
                      : "bg-card text-foreground shadow-[0_4px_16px_rgba(0,1,255,0.05)]",
                  )}
                >
                  <span className="block text-[15px] font-semibold">{occasion.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}
        {step === 1 ? (
          <div className="space-y-4 rounded-[16px] bg-card p-4">
            <Input
              label="Date"
              name="date"
              type="date"
              value={draft.date}
              onChange={(event) => patch({ date: event.target.value })}
            />
            <Input
              label="Start time"
              name="time"
              type="time"
              value={draft.time}
              onChange={(event) => patch({ time: event.target.value })}
            />
            <div className="flex items-center justify-between">
              <span className="text-[17px]">Hours</span>
              <Stepper
                label="hours"
                min={1}
                max={12}
                value={draft.hours}
                onChange={(hours) => patch({ hours })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[17px]">Guests</span>
              <Stepper
                label="guests"
                min={10}
                max={2000}
                step={10}
                value={draft.guests}
                onChange={(guests) => patch({ guests })}
              />
            </div>
            <div>
              <p className="mb-2 text-[15px] font-medium">Setting</p>
              <Segmented
                ariaLabel="Indoor or outdoor"
                value={draft.setting}
                onChange={(setting) => patch({ setting })}
                options={[
                  { id: "indoor", label: "Indoor" },
                  { id: "outdoor", label: "Outdoor" },
                ]}
              />
            </div>
            <Input
              label="Venue"
              name="venue"
              value={draft.venue}
              onChange={(event) => patch({ venue: event.target.value })}
            />
            <Input
              label="City"
              name="city"
              value={draft.city}
              onChange={(event) => patch({ city: event.target.value })}
            />
          </div>
        ) : null}
        {step === 2 ? (
          <div className="grid grid-cols-2 gap-2">
            {talents.map((talent) => {
              const selected = draft.talentSlugs.includes(talent.slug);
              return (
                <button
                  key={talent.slug}
                  type="button"
                  onClick={() =>
                    patch({
                      talentSlugs: selected
                        ? draft.talentSlugs.filter((slug) => slug !== talent.slug)
                        : [...draft.talentSlugs, talent.slug],
                    })
                  }
                  className={cn(
                    "overflow-hidden rounded-[16px] text-left ring-2",
                    selected ? "ring-primary" : "ring-transparent",
                  )}
                >
                  <img src={talent.image} alt="" className="h-24 w-full object-cover" />
                  <span
                    className={cn(
                      "block px-2 py-2 text-[15px] font-semibold",
                      selected ? "bg-tint text-primary" : "bg-card",
                    )}
                  >
                    {talent.title}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
        {step === 3 ? (
          <div className="space-y-4">
            <Segmented
              ariaLabel="Booking as"
              value={prefilled.accountType}
              onChange={(accountType) => patch({ accountType })}
              options={[
                { id: "individual", label: "Individual" },
                { id: "business", label: "Business" },
              ]}
            />
            <Input
              label="Full Name"
              name="name"
              value={prefilled.name}
              onChange={(event) => patch({ name: event.target.value })}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={prefilled.email}
              onChange={(event) => patch({ email: event.target.value })}
            />
            <Input
              label="Phone"
              name="tel"
              type="tel"
              value={prefilled.phone}
              onChange={(event) => patch({ phone: event.target.value })}
            />
            {prefilled.accountType === "business" ? (
              <Input
                label="Company"
                name="organization"
                value={prefilled.company}
                onChange={(event) => patch({ company: event.target.value })}
              />
            ) : null}
            <label className="block">
              <span className="mb-1.5 block text-[15px] font-medium">Notes</span>
              <textarea
                value={draft.notes}
                onChange={(event) => patch({ notes: event.target.value })}
                rows={4}
                placeholder="Theme, must-play songs, timing…"
                className="w-full rounded-[12px] bg-card px-4 py-3 text-[17px] outline-none ring-1 ring-separator focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>
        ) : null}
        {step === 4 ? (
          <div className="space-y-2 rounded-[16px] bg-card p-4 text-[15px]">
            {[
              ["Event", draft.eventType],
              ["When", `${draft.date} · ${draft.time} · ${draft.hours} hrs`],
              ["Where", `${draft.venue}, ${draft.city} · ${draft.setting}`],
              ["Guests", String(draft.guests)],
              [
                "Talent",
                draft.talentSlugs
                  .map((slug) => talentBySlug(slug)?.title)
                  .filter(Boolean)
                  .join(", "),
              ],
              ["Contact", `${prefilled.name} · ${prefilled.email}`],
              ["Notes", draft.notes || "None"],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-separator py-2 last:border-0">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-secondary-text">
                  {label}
                </p>
                <p className="text-[17px]">{value}</p>
              </div>
            ))}
            <button
              type="button"
              className="pt-2 text-[15px] font-semibold text-primary"
              onClick={() => setStep(0)}
            >
              Edit event
            </button>
          </div>
        ) : null}
        <Button disabled={sending} onClick={next}>
          {sending ? "Sending…" : step === steps.length - 1 ? "Submit Request" : "Continue"}
        </Button>
      </div>
    </ScreenContainer>
  );
}
