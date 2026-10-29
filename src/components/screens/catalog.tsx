import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AppHeader,
  Button,
  EmptyState,
  NavBar,
  ScreenContainer,
  SearchField,
  Segmented,
} from "../ios";
import { serviceBySlug, services, talentBySlug, talents, type Service } from "../../lib/content";
import { haptic } from "../../lib/haptics";
import { Sparkles } from "lucide-react";

export function ServicesScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "live-music" | "specialty" | "custom">("all");
  const normalized = query.trim().toLowerCase();

  const serviceCards = services.filter((service) => {
    if (filter !== "all" && service.slug !== filter) return false;
    if (!normalized) return true;
    return `${service.title} ${service.blurb}`.toLowerCase().includes(normalized);
  });

  const talentCards = talents.filter((talent) => {
    if (filter !== "all" && filter !== "custom" && talent.service !== filter) return false;
    if (filter === "custom") return false;
    if (!normalized) return true;
    return `${talent.title} ${talent.summary}`.toLowerCase().includes(normalized);
  });

  return (
    <ScreenContainer tab>
      <AppHeader title="Services" subtitle="Live music, specialty acts, and custom lineups.">
        <div className="space-y-3">
          <SearchField value={query} onChange={setQuery} placeholder="Search talent and services" />
          <Segmented
            ariaLabel="Service filter"
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all", label: "All" },
              { id: "live-music", label: "Music" },
              { id: "specialty", label: "Specialty" },
              { id: "custom", label: "Custom" },
            ]}
          />
        </div>
      </AppHeader>
      {serviceCards.length === 0 && talentCards.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No matches"
          body="Try another name, or browse all services."
          action={
            <Button
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear Search
            </Button>
          }
        />
      ) : (
        <div className="space-y-4 px-4 pt-4">
          {serviceCards.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
          {talentCards.map((talent) => (
            <Link
              key={talent.slug}
              to="/talent/$slug"
              params={{ slug: talent.slug }}
              onClick={() => haptic("tap")}
              className="flex items-center gap-3 rounded-[16px] bg-card p-3 shadow-[0_4px_16px_rgba(0,1,255,0.06)]"
            >
              <img src={talent.image} alt="" className="size-16 rounded-[12px] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-semibold">{talent.title}</p>
                <p className="mt-0.5 text-[15px] leading-snug text-secondary-text">
                  {talent.summary}
                </p>
              </div>
              <ChevronRight className="size-5 text-primary" />
            </Link>
          ))}
        </div>
      )}
    </ScreenContainer>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      onClick={() => haptic("tap")}
      className="block overflow-hidden rounded-[16px] bg-card shadow-[0_4px_16px_rgba(0,1,255,0.08)]"
    >
      <div className="relative">
        <img src={service.image} alt="" className="h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="text-[22px] font-semibold text-white">{service.title}</h2>
        </div>
      </div>
      <p className="px-4 py-3 text-[15px] leading-snug text-secondary-text">{service.blurb}</p>
    </Link>
  );
}

export function ServiceDetail({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  const navigate = useNavigate();
  const related = useMemo(() => talents.filter((talent) => talent.service === slug), [slug]);
  if (!service) {
    return (
      <ScreenContainer>
        <NavBar title="Services" backTo="/services" />
        <EmptyState
          icon={Sparkles}
          title="Service not found"
          body="That category is no longer available."
        />
      </ScreenContainer>
    );
  }
  return (
    <ScreenContainer>
      <NavBar overlay backTo="/services" />
      <div className="relative">
        <img src={service.image} alt="" className="h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <h1 className="absolute inset-x-0 bottom-0 p-4 text-[28px] font-bold leading-tight text-white">
          {service.title}
        </h1>
      </div>
      <div className="space-y-5 px-4 py-5">
        <p className="text-[17px] leading-relaxed">{service.description}</p>
        <div>
          <h2 className="text-[22px] font-semibold">What’s included</h2>
          <ul className="mt-3 space-y-2">
            {service.includes.map((item) => (
              <li
                key={item}
                className="rounded-[12px] bg-card px-4 py-3 text-[15px] shadow-[0_4px_16px_rgba(0,1,255,0.05)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        {related.length ? (
          <div>
            <h2 className="mb-3 text-[22px] font-semibold">Talent in this category</h2>
            <div className="space-y-2">
              {related.map((talent) => (
                <Link
                  key={talent.slug}
                  to="/talent/$slug"
                  params={{ slug: talent.slug }}
                  className="flex items-center gap-3 rounded-[14px] bg-card p-2"
                >
                  <img src={talent.image} alt="" className="size-14 rounded-[12px] object-cover" />
                  <span className="flex-1 text-[17px] font-semibold">{talent.title}</span>
                  <ChevronRight className="size-5 text-primary" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <Button
          onClick={() => {
            sessionStorage.setItem("rjr-prefill", JSON.stringify({ event: "", talent: "" }));
            navigate({ to: "/request" });
          }}
        >
          Request This
        </Button>
      </div>
    </ScreenContainer>
  );
}

export function TalentDetail({ slug }: { slug: string }) {
  const talent = talentBySlug(slug);
  const navigate = useNavigate();
  if (!talent) {
    return (
      <ScreenContainer>
        <NavBar title="Talent" backTo="/services" />
        <EmptyState
          icon={Sparkles}
          title="Talent not found"
          body="Try another act from Services."
        />
      </ScreenContainer>
    );
  }
  const service = serviceBySlug(talent.service);
  return (
    <ScreenContainer>
      <NavBar overlay backTo="/services" />
      <div className="relative">
        <img src={talent.image} alt="" className="h-72 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-white/80">
            {service?.title}
          </p>
          <h1 className="text-[34px] font-bold leading-none text-white">{talent.title}</h1>
        </div>
      </div>
      <div className="space-y-5 px-4 py-5">
        <p className="text-[17px] leading-relaxed">{talent.detail}</p>
        <ul className="space-y-2">
          {talent.points.map((point) => (
            <li
              key={point}
              className="rounded-[12px] bg-tint px-4 py-3 text-[15px] font-medium text-primary"
            >
              {point}
            </li>
          ))}
        </ul>
        <Button
          onClick={() => {
            sessionStorage.setItem(
              "rjr-prefill",
              JSON.stringify({ event: "", talent: talent.slug }),
            );
            navigate({ to: "/request" });
          }}
        >
          Request {talent.title}
        </Button>
      </div>
    </ScreenContainer>
  );
}
