import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, Clapperboard, Phone, Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, ScreenContainer, SectionHeader, Skeleton, Stars } from "../ios";
import {
  heroImage,
  occasions,
  PHONE_DISPLAY,
  PHONE_TEL,
  services,
  TAGLINE,
  talents,
  testimonials,
} from "../../lib/content";
import { haptic } from "../../lib/haptics";
import { useApp } from "../../lib/store";

export function HomeScreen() {
  const { hydrated, user, unreadCount } = useApp();
  const navigate = useNavigate();
  const [booted, setBooted] = useState(false);

  const first = user?.fullName.split(" ")[0];
  const loading = !hydrated || !booted;

  useEffect(() => {
    if (sessionStorage.getItem("rjr-home-booted") === "1") {
      setBooted(true);
      return;
    }
    const timer = window.setTimeout(() => {
      sessionStorage.setItem("rjr-home-booted", "1");
      setBooted(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ScreenContainer tab>
      <header data-chrome className="z-30 shrink-0 bg-[#07070f] text-white">
        <div className="status-bar" />
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9aa0ff]">
              Licensed agency
            </p>
            <p className="mt-1 text-[17px] font-bold leading-none tracking-tight">
              RJR <span className="font-medium text-white/75">Talent</span>
            </p>
          </div>
          <Link
            to="/notifications"
            aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
            className="relative grid size-10 place-items-center rounded-full bg-white/10 text-white"
            onClick={() => haptic("tap")}
          >
            <Bell className="size-5" />
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </Link>
        </div>
        <div className="h-[3px] bg-[#0001FF]" />
      </header>
      {loading ? (
        <div className="space-y-4 px-4 pt-4">
          <Skeleton className="h-64 w-full rounded-[20px]" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <div className="animate-rise space-y-5 pt-4">
          <div className="px-4">
            <div className="relative overflow-hidden rounded-[20px] shadow-[0_10px_28px_rgba(7,7,15,0.18)]">
              <img
                src={heroImage}
                alt="Guests dancing at a live event"
                className="h-[248px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-[#07070f]/55 to-[#07070f]/5" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                  Winter Garden, Florida
                </p>
                <h1 className="mt-1 text-[24px] font-bold leading-tight text-white">
                  {first ? `Hello, ${first}` : "Welcome"}
                </h1>
                <p className="mt-1 text-[13px] leading-snug text-white/85">{TAGLINE}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/request" })}
                    className="h-10 rounded-full bg-[#0001FF] text-[13px] font-semibold text-white"
                  >
                    Request Talent
                  </button>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="flex h-10 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-[#0001FF]"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 px-4">
            {[
              { label: "Request Talent", icon: Plus, to: "/request" as const },
              { label: "Services", icon: Sparkles, to: "/services" as const },
              { label: "Videos", icon: Clapperboard, to: "/gallery" as const, videos: true },
              { label: "Contact Us", icon: Phone, to: "/contact" as const },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                onClick={() => {
                  haptic("tap");
                  if ("videos" in action) sessionStorage.setItem("rjr-gallery-tab", "videos");
                }}
                className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[16px] bg-card px-1 py-3 text-center shadow-[0_4px_16px_rgba(0,1,255,0.06)]"
              >
                <span className="grid size-11 place-items-center rounded-[14px] bg-tint text-primary">
                  <action.icon className="size-5" />
                </span>
                <span className="text-[12px] font-semibold leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>

          <section>
            <SectionHeader title="Our Services" action="View All" to="/services" />
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  onClick={() => haptic("tap")}
                  className="w-[250px] shrink-0 overflow-hidden rounded-[16px] bg-card shadow-[0_4px_16px_rgba(0,1,255,0.08)]"
                >
                  <img src={service.image} alt="" className="h-32 w-full object-cover" />
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[17px] font-semibold leading-tight">{service.title}</h3>
                      <ChevronRight className="mt-0.5 size-5 shrink-0 text-primary" />
                    </div>
                    <p className="mt-1 line-clamp-2 text-[15px] leading-snug text-secondary-text">
                      {service.blurb}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Browse by Talent Type" action="View All" to="/services" />
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
              {talents.map((talent) => (
                <Link
                  key={talent.slug}
                  to="/talent/$slug"
                  params={{ slug: talent.slug }}
                  onClick={() => haptic("tap")}
                  className="w-[84px] shrink-0 text-center"
                >
                  <img
                    src={talent.image}
                    alt=""
                    className="size-[84px] rounded-full object-cover ring-2 ring-white"
                  />
                  <p className="mt-2 text-[12px] font-semibold leading-tight">{talent.title}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Perfect For" />
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
              {occasions.map((occasion) => (
                <Link
                  key={occasion.id}
                  to="/request"
                  onClick={() => {
                    haptic("tap");
                    sessionStorage.setItem(
                      "rjr-prefill",
                      JSON.stringify({ event: occasion.id, talent: "" }),
                    );
                  }}
                  className="shrink-0 rounded-full bg-tint px-4 py-2 text-[15px] font-semibold text-primary"
                >
                  {occasion.label}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Testimonials" />
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
              {testimonials.map((item) => (
                <Card key={item.id} className="w-[280px] shrink-0 p-4">
                  <Stars />
                  <p className="mt-3 text-[15px] leading-relaxed">“{item.quote}”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <img src={item.avatar} alt="" className="size-11 rounded-full object-cover" />
                    <div>
                      <p className="text-[15px] font-semibold">{item.name}</p>
                      <p className="text-[12px] text-secondary-text">
                        {item.detail} · {item.service}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="px-4">
            <h2 className="mb-3 text-[18px] font-semibold">How a Request Works</h2>
            <div className="space-y-3">
              {[
                ["1", "Tell us about the event", "Date, venue, guests, and the feeling you want."],
                ["2", "We match the lineup", "A licensed agency pairs you with vetted performers."],
                ["3", "You celebrate", "We follow up with the right entertainment for the night."],
              ].map(([step, title, body]) => (
                <div
                  key={step}
                  className="flex gap-3 rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(0,1,255,0.06)]"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-[15px] font-bold text-white">
                    {step}
                  </span>
                  <div>
                    <p className="text-[17px] font-semibold">{title}</p>
                    <p className="mt-1 text-[15px] leading-snug text-secondary-text">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-4">
            <Card className="overflow-hidden">
              <div className="bg-primary px-4 py-5 text-white">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-white/80">
                  Let’s make it unforgettable
                </p>
                <h2 className="mt-1 text-[18px] font-semibold leading-snug">
                  Founded in 2018. Fully insured. Based in Central Florida.
                </h2>
                <p className="mt-2 text-[15px] text-white/90">{PHONE_DISPLAY}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                <Link
                  to="/request"
                  className="flex h-12 items-center justify-center rounded-[14px] bg-primary text-[15px] font-semibold text-white"
                >
                  Request Talent
                </Link>
                <Link
                  to="/contact"
                  className="flex h-12 items-center justify-center rounded-[14px] bg-tint text-[15px] font-semibold text-primary"
                >
                  Contact Us
                </Link>
              </div>
            </Card>
          </section>
        </div>
      )}
    </ScreenContainer>
  );
}
