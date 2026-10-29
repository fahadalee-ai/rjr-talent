import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, FileText, Info, Inbox, LogOut, Mail, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertCard,
  Button,
  Card,
  EmptyState,
  AppHeader,
  formatWhen,
  NavBar,
  ScreenContainer,
  ListItem,
  Segmented,
  statusLabel,
  Switch,
  TextField,
} from "../ios";
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_TEL } from "../../lib/content";
import { haptic } from "../../lib/haptics";
import { useApp, type ThemeMode } from "../../lib/store";
import { cn } from "../../lib/utils";

export function ProfileScreen() {
  const app = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!app.user) return;
    setName(app.user.fullName);
    setPhone(app.user.phone);
    setCompany(app.user.company ?? "");
  }, [app.user]);
  const [confirmOut, setConfirmOut] = useState(false);
  const [name, setName] = useState(app.user?.fullName ?? "");
  const [phone, setPhone] = useState(app.user?.phone ?? "");
  const [company, setCompany] = useState(app.user?.company ?? "");

  const mine = app.requests.filter((item) =>
    app.user ? item.userId === app.user.id || item.email === app.user.email : false,
  );

  return (
    <ScreenContainer tab>
      <AppHeader title="Profile" subtitle={app.user ? app.user.email : "Guest"} />
      <div className="space-y-4 px-4 pt-4">
        {app.user ? (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-14 place-items-center rounded-full bg-tint text-[22px] font-bold text-primary">
                {app.user.fullName.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[20px] font-semibold">{app.user.fullName}</p>
                <p className="text-[15px] capitalize text-secondary-text">
                  {app.user.accountType}
                  {app.user.company ? ` · ${app.user.company}` : ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-3 text-[17px] font-semibold text-primary"
            >
              Edit profile
            </button>
          </Card>
        ) : (
          <Card className="p-4">
            <h2 className="text-[22px] font-semibold">Sign in to track requests</h2>
            <p className="mt-1 text-[15px] leading-relaxed text-secondary-text">
              Guests can browse and send an inquiry. An account keeps your requests in one place.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={() => navigate({ to: "/login" })}>Log In</Button>
              <Button variant="secondary" onClick={() => navigate({ to: "/register" })}>
                Register
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <ListItem
            icon={Inbox}
            label="My Requests"
            value={app.user ? String(mine.length) : undefined}
            to="/requests"
          />
          <ListItem
            icon={Bell}
            label="Notifications"
            value={app.unreadCount ? `${app.unreadCount} new` : undefined}
            to="/notifications"
            last
          />
        </Card>

        <div>
          <p className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-secondary-text">
            Appearance
          </p>
          <Card className="p-3">
            <Segmented
              ariaLabel="Appearance"
              value={app.theme}
              onChange={(theme: ThemeMode) => app.setTheme(theme)}
              options={[
                { id: "light", label: "Light" },
                { id: "dark", label: "Dark" },
                { id: "system", label: "System" },
              ]}
            />
          </Card>
        </div>

        <div>
          <p className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-secondary-text">
            Notifications
          </p>
          <Card>
            {(
              [
                ["bookings", "Booking updates"],
                ["reels", "New performance reels"],
                ["offers", "Offers and dates"],
              ] as const
            ).map(([key, label], index, list) => (
              <div
                key={key}
                className={cn(
                  "flex min-h-[52px] items-center justify-between px-4",
                  index < list.length - 1 && "border-b border-separator",
                )}
              >
                <span className="text-[17px]">{label}</span>
                <Switch
                  checked={app.prefs[key]}
                  label={label}
                  onChange={() => app.togglePref(key)}
                />
              </div>
            ))}
          </Card>
        </div>

        <Card>
          <ListItem icon={Info} label="About RJR Talent" to="/about" />
          <ListItem icon={Phone} label="Contact" to="/contact" />
          <ListItem icon={FileText} label="Terms & Privacy" to="/legal" last />
        </Card>

        {app.user ? (
          <Card>
            <ListItem
              icon={LogOut}
              label="Log Out"
              destructive
              last
              onClick={() => setConfirmOut(true)}
            />
          </Card>
        ) : null}
      </div>

      {editing && app.user ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setEditing(false)}
          />
          <form
            className="animate-sheet relative w-full max-w-[430px] space-y-3 rounded-t-[20px] bg-card p-4 pb-[max(20px,env(safe-area-inset-bottom))]"
            onSubmit={(event) => {
              event.preventDefault();
              app.updateProfile({
                fullName: name.trim(),
                phone: phone.trim(),
                company: company.trim() || undefined,
              });
              haptic("success");
              app.pushToast("Profile updated");
              setEditing(false);
            }}
          >
            <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-separator" />
            <h2 className="text-[22px] font-semibold">Edit Profile</h2>
            <TextField
              label="Full Name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              label="Phone"
              name="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <TextField
              label="Company"
              name="organization"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
            <Button type="submit">Save</Button>
          </form>
        </div>
      ) : null}

      <AlertCard
        open={confirmOut}
        title="Log out?"
        message="You can sign back in anytime to see your requests."
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        destructive
        onClose={() => setConfirmOut(false)}
        onConfirm={() => {
          app.logout();
          navigate({ to: "/login", replace: true });
        }}
      />
    </ScreenContainer>
  );
}

export function NotificationsScreen() {
  const { visibleNotices, markAllRead, markNotificationRead, hydrated } = useApp();
  const navigate = useNavigate();
  return (
    <ScreenContainer>
      <NavBar title="Notifications" backTo="/profile" />
      <div className="flex justify-end px-4">
        <button
          type="button"
          className="text-[15px] font-semibold text-primary"
          onClick={markAllRead}
        >
          Mark All Read
        </button>
      </div>
      {!hydrated || visibleNotices.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Bell}
            title="You’re all caught up"
            body="Booking updates and new reels will land here."
          />
        </div>
      ) : (
        <div className="mt-3 space-y-2 px-4">
          {visibleNotices.map((notice) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => {
                markNotificationRead(notice.id);
                if (notice.href.startsWith("/requests/")) {
                  const id = notice.href.split("/").pop() ?? "";
                  navigate({ to: "/requests/$id", params: { id } });
                } else if (notice.href.startsWith("/gallery")) {
                  sessionStorage.setItem("rjr-gallery-tab", "videos");
                  navigate({ to: "/gallery" });
                } else {
                  navigate({ to: "/request" });
                }
              }}
              className={cn(
                "w-full rounded-[16px] p-4 text-left",
                notice.read ? "bg-card" : "bg-tint",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[17px] font-semibold">{notice.title}</p>
                <span className="text-[12px] text-secondary-text">{notice.time}</span>
              </div>
              <p className="mt-1 text-[15px] leading-snug text-secondary-text">{notice.body}</p>
            </button>
          ))}
        </div>
      )}
    </ScreenContainer>
  );
}

export function RequestsScreen() {
  const { user, requests, hydrated } = useApp();
  const mine = requests.filter((item) =>
    user ? item.userId === user.id || item.email.toLowerCase() === user.email.toLowerCase() : false,
  );
  return (
    <ScreenContainer>
      <NavBar title="My Requests" backTo="/profile" />
      {!hydrated ? null : !user ? (
        <EmptyState
          icon={UserRound}
          title="Sign in to see requests"
          body="Guest inquiries are sent to the agency, and saved here once you have an account."
          action={
            <Link
              to="/login"
              className="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-[17px] font-semibold text-white"
            >
              Log In
            </Link>
          }
        />
      ) : mine.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests yet"
          body="When you request talent, the status will show up here."
          action={
            <Link
              to="/request"
              className="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-[17px] font-semibold text-white"
            >
              Request Talent
            </Link>
          }
        />
      ) : (
        <div className="space-y-3 px-4">
          {mine.map((item) => (
            <Link
              key={item.id}
              to="/requests/$id"
              params={{ id: item.id }}
              className="block rounded-[16px] bg-card p-4 shadow-[0_4px_16px_rgba(0,1,255,0.06)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[17px] font-semibold">{item.eventType}</p>
                <span className="rounded-full bg-tint px-2 py-1 text-[12px] font-semibold text-primary">
                  {statusLabel(item.status)}
                </span>
              </div>
              <p className="mt-1 text-[15px] text-secondary-text">
                {formatWhen(item.date, item.time)}
              </p>
              <p className="mt-1 text-[15px]">{item.venue}</p>
              <p className="mt-2 text-[12px] font-semibold text-secondary-text">{item.reference}</p>
            </Link>
          ))}
        </div>
      )}
    </ScreenContainer>
  );
}

export function RequestDetail({ id }: { id: string }) {
  const { requests } = useApp();
  const item = requests.find((entry) => entry.id === id);
  if (!item) {
    return (
      <ScreenContainer>
        <NavBar title="Request" backTo="/requests" />
        <EmptyState
          icon={Inbox}
          title="Request not found"
          body="It may have been started on another device."
        />
      </ScreenContainer>
    );
  }
  const stages = ["submitted", "reviewing", "confirmed"] as const;
  const active = stages.indexOf(item.status);
  return (
    <ScreenContainer>
      <NavBar title={item.reference} backTo="/requests" />
      <div className="space-y-4 px-4">
        <div>
          <h1 className="text-[34px] font-bold leading-tight">{item.eventType}</h1>
          <p className="mt-1 text-[17px] text-secondary-text">{formatWhen(item.date, item.time)}</p>
        </div>
        <div className="rounded-[16px] bg-card p-4">
          <p className="text-[15px] font-semibold">Status</p>
          <div className="mt-3 flex items-center justify-between">
            {stages.map((stage, index) => (
              <div key={stage} className="flex flex-1 flex-col items-center">
                <span
                  className={cn(
                    "size-3 rounded-full",
                    index <= active ? "bg-primary" : "bg-separator",
                  )}
                />
                <span className="mt-2 text-center text-[12px] font-medium">
                  {statusLabel(stage)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2 rounded-[16px] bg-card p-4 text-[17px]">
          <p>
            {item.venue}, {item.city}
          </p>
          <p className="text-[15px] text-secondary-text capitalize">
            {item.setting} · {item.hours} hours · {item.guests} guests
          </p>
          <p className="text-[15px]">{item.talents.join(", ")}</p>
          {item.notes ? (
            <p className="text-[15px] leading-relaxed text-secondary-text">{item.notes}</p>
          ) : null}
        </div>
        <a
          href={`tel:${PHONE_TEL}`}
          className="flex h-[52px] items-center justify-center rounded-[14px] bg-tint text-[17px] font-semibold text-primary"
        >
          Call the agency
        </a>
      </div>
    </ScreenContainer>
  );
}

export function AboutScreen() {
  return (
    <ScreenContainer>
      <NavBar title="About" backTo="/profile" />
      <div className="space-y-4 px-4">
        <h1 className="text-[34px] font-bold leading-tight">Talent you can count on</h1>
        <p className="text-[17px] leading-relaxed">
          Founded in 2018, RJR Talent is a licensed talent agency in Winter Garden, Florida. We
          connect Central Florida events with professional live bands, DJs, magicians, dancers,
          stilt walkers, and more.
        </p>
        <p className="text-[17px] leading-relaxed text-secondary-text">
          Every collaboration is meant to be memorable for your guests. Performers are prepared,
          fully insured, and ready to dress for the occasion. Musicians bring their own PA.
        </p>
        <div className="rounded-[16px] bg-card p-4 text-[15px] leading-relaxed">
          <p className="font-semibold">RJR Talent</p>
          <p className="mt-1">{ADDRESS}</p>
          <p className="mt-2">{PHONE_DISPLAY}</p>
          <p>{EMAIL}</p>
        </div>
      </div>
    </ScreenContainer>
  );
}

export function ContactScreen() {
  const { user, pushToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (!user) return;
    setName((current) => current || user.fullName);
    setEmail((current) => current || user.email);
  }, [user]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <ScreenContainer>
        <NavBar title="Contact" backTo="/profile" />
        <div className="px-4 pt-8 text-center">
          <div className="animate-check mx-auto grid size-16 place-items-center rounded-full bg-success text-3xl text-white">
            ✓
          </div>
          <h1 className="mt-4 text-[28px] font-bold">Message sent</h1>
          <p className="mt-2 text-[17px] text-secondary-text">We’ll reply at {email}.</p>
          <div className="mt-6">
            <Button onClick={() => setSent(false)}>Send another</Button>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <NavBar title="Contact" backTo="/profile" />
      <div className="space-y-4 px-4">
        <h1 className="text-[34px] font-bold leading-tight">Let’s talk</h1>
        <p className="text-[17px] text-secondary-text">
          Call, email, or send a note about your event.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex h-[72px] flex-col items-center justify-center rounded-[16px] bg-card text-[15px] font-semibold"
          >
            <Phone className="mb-1 size-5 text-primary" />
            Call
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex h-[72px] flex-col items-center justify-center rounded-[16px] bg-card text-[15px] font-semibold"
          >
            <Mail className="mb-1 size-5 text-primary" />
            Email
          </a>
        </div>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (
              name.trim().length < 2 ||
              !/^\S+@\S+\.\S+$/.test(email) ||
              message.trim().length < 8
            ) {
              setError("Add your name, a valid email, and a short message.");
              haptic("error");
              return;
            }
            setError("");
            setSent(true);
            pushToast("Message sent");
            haptic("success");
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className="block">
            <span className="mb-1.5 block text-[15px] font-medium">Message</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="w-full rounded-[12px] bg-card px-4 py-3 text-[17px] outline-none ring-1 ring-separator focus:ring-2 focus:ring-primary"
            />
          </label>
          {error ? <p className="text-[15px] text-danger">{error}</p> : null}
          <Button type="submit">Send Message</Button>
        </form>
        <p className="text-[15px] text-secondary-text">{ADDRESS}</p>
      </div>
    </ScreenContainer>
  );
}

export function LegalScreen() {
  const [tab, setTab] = useState<"terms" | "privacy">("terms");
  return (
    <ScreenContainer>
      <NavBar title="Legal" backTo="/profile" />
      <div className="px-4">
        <Segmented
          ariaLabel="Legal documents"
          value={tab}
          onChange={setTab}
          options={[
            { id: "terms", label: "Terms" },
            { id: "privacy", label: "Privacy" },
          ]}
        />
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-secondary-text">
          {tab === "terms" ? (
            <>
              <h1 className="text-[28px] font-bold text-foreground">Terms of use</h1>
              <p>
                RJR Talent provides this app so you can explore entertainment and send a booking
                inquiry. Submitting a request is not a confirmed booking. Availability, pricing, and
                performer details are confirmed by the agency.
              </p>
              <p>
                Performances are provided by a licensed, insured talent agency serving Central
                Florida. You agree to share accurate event details so we can respond with a suitable
                lineup.
              </p>
              <p>
                Questions: {EMAIL} · {PHONE_DISPLAY}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[28px] font-bold text-foreground">Privacy</h1>
              <p>
                We use the name, email, phone, and event details you submit to respond to your
                inquiry and keep a record of the request on this device. This preview stores that
                information locally in your browser.
              </p>
              <p>
                We do not sell your information. Contact {EMAIL} to ask about a request you sent.
              </p>
            </>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}
