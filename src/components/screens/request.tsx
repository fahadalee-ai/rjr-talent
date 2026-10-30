import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, ScreenContainer, Stepper } from "../ios";
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

const steps = [
  { title: "Event", hint: "Choose the occasion" },
  { title: "When & where", hint: "Date, place, and how long" },
  { title: "Talent", hint: "Select one or more acts" },
  { title: "Your details", hint: "How should we reach you?" },
  { title: "Review", hint: "Confirm before you send" },
];

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

  useEffect(() => {
    document.querySelectorAll(".screen-scroll").forEach((node) => {
      node.scrollTop = 0;
    });
  }, [step]);

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

  const current = steps[step] ?? steps[0];
  const talentNames = draft.talentSlugs
    .map((slug) => talentBySlug(slug)?.title)
    .filter(Boolean)
    .join(", ");

  if (done) {
    return (
      <ScreenContainer tab>
        <div className="status-bar" />
        <div className="flex flex-col items-center px-6 pt-10 text-center">
          <div className="animate-check grid size-16 place-items-center rounded-full bg-[#0001FF] text-white">
            <Check className="size-8" strokeWidth={2.5} />
          </div>
          <h1 className="mt-5 text-[24px] font-bold leading-tight">Request sent</h1>
          <p className="mt-2 max-w-[18rem] text-[14px] leading-snug text-secondary-text">
            Our team will follow up
            {draft.eventType ? ` about your ${draft.eventType.toLowerCase()}` : ""}.
          </p>
          <p className="mt-4 rounded-full bg-tint px-3 py-1 text-[13px] font-semibold text-[#0001FF]">
            {done.reference}
          </p>
          <div className="mt-8 w-full space-y-3">
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
      <header data-chrome className="z-30 shrink-0 bg-[#07070f] text-white">
        <div className="status-bar" />
        <div className="px-4 pb-4">
          <div className="flex h-8 items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                className="text-[14px] font-semibold text-white"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            ) : (
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                Request
              </span>
            )}
            <p className="text-[12px] font-semibold text-white/70">
              {step + 1} / {steps.length}
            </p>
          </div>
          <div className="mt-2 flex gap-1">
            {steps.map((item, index) => (
              <span
                key={item.title}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  index <= step ? "bg-[#0001FF]" : "bg-white/20",
                )}
              />
            ))}
          </div>
          <h1 className="mt-3 text-[22px] font-bold leading-none tracking-tight">{current.title}</h1>
          <p className="mt-1.5 text-[13px] text-white/70">{current.hint}</p>
        </div>
      </header>
      <div className="space-y-4 px-4 pb-2 pt-4">
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
                    "relative min-h-[92px] rounded-[16px] px-3 py-3 text-left shadow-[0_4px_16px_rgba(0,1,255,0.05)]",
                    selected ? "bg-tint ring-2 ring-[#0001FF]" : "bg-card",
                  )}
                >
                  {selected ? (
                    <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-[#0001FF] text-white">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  ) : null}
                  <span className="block pr-4 text-[15px] font-semibold leading-tight">
                    {occasion.label}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[12px] leading-snug text-secondary-text">
                    {occasion.blurb}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
        {step === 1 ? (
          <div className="space-y-4 rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(0,1,255,0.05)]">
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
            <div className="flex items-center justify-between border-t border-separator pt-3">
              <span className="text-[15px] font-medium">Hours</span>
              <Stepper
                label="hours"
                min={1}
                max={12}
                value={draft.hours}
                onChange={(hours) => patch({ hours })}
              />
            </div>
            <div className="flex items-center justify-between border-t border-separator pt-3">
              <span className="text-[15px] font-medium">Guests</span>
              <Stepper
                label="guests"
                min={10}
                max={2000}
                step={10}
                value={draft.guests}
                onChange={(guests) => patch({ guests })}
              />
            </div>
            <div className="border-t border-separator pt-3">
              <p className="mb-2 text-[15px] font-medium">Setting</p>
              <div className="grid grid-cols-2 gap-1 rounded-full bg-[#ececf4] p-1">
                {(["indoor", "outdoor"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => patch({ setting: option })}
                    className={cn(
                      "h-10 rounded-full text-[14px] font-semibold capitalize",
                      draft.setting === option ? "bg-[#0001FF] text-white" : "text-[#5c5c70]",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Venue"
              name="venue"
              placeholder="Venue name"
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
          <div className="grid grid-cols-2 gap-2.5">
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
                    "overflow-hidden rounded-[16px] text-left shadow-[0_4px_16px_rgba(0,1,255,0.06)] ring-2",
                    selected ? "ring-[#0001FF]" : "ring-transparent",
                  )}
                >
                  <span className="relative block">
                    <img src={talent.image} alt="" className="h-28 w-full object-cover" />
                    {selected ? (
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-[#0001FF] text-white">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                    ) : null}
                  </span>
                  <span className="block bg-card px-2.5 py-2.5 text-[14px] font-semibold leading-tight">
                    {talent.title}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
        {step === 3 ? (
          <div className="space-y-4 rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(0,1,255,0.05)]">
            <div>
              <p className="mb-2 text-[15px] font-medium">I’m booking as</p>
              <div className="grid grid-cols-2 gap-1 rounded-full bg-[#ececf4] p-1">
                {(
                  [
                    { id: "individual", label: "Individual" },
                    { id: "business", label: "Business" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => patch({ accountType: option.id })}
                    className={cn(
                      "h-10 rounded-full text-[14px] font-semibold",
                      prefilled.accountType === option.id
                        ? "bg-[#0001FF] text-white"
                        : "text-[#5c5c70]",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
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
                className="w-full rounded-[12px] bg-grouped px-3 py-3 text-[16px] outline-none ring-1 ring-separator focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>
        ) : null}
        {step === 4 ? (
          <div className="overflow-hidden rounded-[16px] bg-card shadow-[0_4px_16px_rgba(0,1,255,0.05)]">
            {[
              ["Event", draft.eventType || "Not selected"],
              ["When", [draft.date || "Date not set", draft.time, `${draft.hours} hrs`].join(" · ")],
              [
                "Where",
                [draft.venue || "Venue not set", draft.city, draft.setting].filter(Boolean).join(" · "),
              ],
              ["Guests", String(draft.guests)],
              ["Talent", talentNames || "Not selected"],
              ["Contact", [prefilled.name, prefilled.email, prefilled.phone].filter(Boolean).join(" · ") || "Not added"],
              ["Notes", draft.notes.trim() || "None"],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-separator px-4 py-3 last:border-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary-text">
                  {label}
                </p>
                <p className="mt-1 text-[15px] font-medium leading-snug">{value}</p>
              </div>
            ))}
            <button
              type="button"
              className="w-full px-4 py-3 text-left text-[14px] font-semibold text-[#0001FF]"
              onClick={() => setStep(0)}
            >
              Edit from the start
            </button>
          </div>
        ) : null}
      </div>
      <div data-chrome="footer" className="shrink-0 border-t border-separator bg-grouped px-4 py-3">
        <Button disabled={sending} onClick={next}>
          {sending ? "Sending…" : step === steps.length - 1 ? "Submit Request" : "Continue"}
        </Button>
      </div>
    </ScreenContainer>
  );
}
