import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_EMAIL, DEMO_PASSWORD } from "./content";
import { readStorage, writeStorage } from "./storage";

export type AccountType = "individual" | "business";
export type ThemeMode = "light" | "dark" | "system";
export type RequestStatus = "submitted" | "reviewing" | "confirmed";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  accountType: AccountType;
  company?: string;
};

export type TalentRequest = {
  id: string;
  userId: string | null;
  reference: string;
  createdAt: string;
  eventType: string;
  date: string;
  time: string;
  hours: number;
  guests: number;
  setting: "indoor" | "outdoor";
  venue: string;
  city: string;
  talents: string[];
  notes: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: RequestStatus;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
  audience: "all" | string;
};

export type Prefs = {
  bookings: boolean;
  reels: boolean;
  offers: boolean;
};

export type Toast = { id: number; title: string; body?: string };

type Persisted = {
  users: User[];
  sessionUserId: string | null;
  guest: boolean;
  onboarded: boolean;
  requests: TalentRequest[];
  notifications: Notice[];
  theme: ThemeMode;
  prefs: Prefs;
};

const STORAGE_KEY = "rjr-talent";

const seedUsers: User[] = [
  {
    id: "u-alex",
    fullName: "Alex Rivera",
    email: DEMO_EMAIL,
    phone: "(407) 555-0188",
    password: DEMO_PASSWORD,
    accountType: "individual",
  },
];

const seedRequests: TalentRequest[] = [
  {
    id: "req-seed",
    userId: "u-alex",
    reference: "RJR-1842",
    createdAt: "2026-10-18T15:00:00.000Z",
    eventType: "Weddings",
    date: "2026-11-14",
    time: "18:00",
    hours: 4,
    guests: 120,
    setting: "indoor",
    venue: "The Grove House",
    city: "Winter Garden",
    talents: ["Live Bands"],
    notes: "Cocktail trio, then a dance set after dinner.",
    name: "Alex Rivera",
    email: DEMO_EMAIL,
    phone: "(407) 555-0188",
    status: "reviewing",
  },
];

const seedNotices: Notice[] = [
  {
    id: "n1",
    title: "Your wedding inquiry is in review",
    body: "Our team is matching a live band for November 14 at The Grove House.",
    time: "2h ago",
    read: false,
    href: "/requests/req-seed",
    audience: "u-alex",
  },
  {
    id: "n2",
    title: "New highlight reel",
    body: "Watch a live band set from a recent Central Florida festival.",
    time: "Yesterday",
    read: false,
    href: "/gallery?tab=videos",
    audience: "all",
  },
  {
    id: "n3",
    title: "Spring dates are opening",
    body: "Festival and wedding weekends fill quickly. Send your date when you have it.",
    time: "Mon",
    read: true,
    href: "/request",
    audience: "all",
  },
];

const seed: Persisted = {
  users: seedUsers,
  sessionUserId: null,
  guest: false,
  onboarded: false,
  requests: seedRequests,
  notifications: seedNotices,
  theme: "light",
  prefs: { bookings: true, reels: true, offers: false },
};

type Store = Persisted & {
  hydrated: boolean;
  user: User | null;
  toasts: Toast[];
  unreadCount: number;
  markOnboarded: () => void;
  continueAsGuest: () => void;
  login: (email: string, password: string) => { ok: true } | { ok: false; reason: "invalid" };
  register: (input: Omit<User, "id">) => { ok: true } | { ok: false; reason: "exists" };
  signInWith: (provider: "apple" | "google") => void;
  logout: () => void;
  updateProfile: (
    patch: Partial<Pick<User, "fullName" | "phone" | "company" | "accountType">>,
  ) => void;
  resetPassword: (
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; reason: "missing" };
  addRequest: (
    input: Omit<TalentRequest, "id" | "reference" | "createdAt" | "status" | "userId">,
  ) => TalentRequest;
  setTheme: (theme: ThemeMode) => void;
  togglePref: (key: keyof Prefs) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  visibleNotices: Notice[];
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || (theme === "system" && systemDark);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(seed);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const saved = readStorage<Persisted | null>(STORAGE_KEY, null);
    if (saved?.users && saved.prefs) {
      setState({
        ...seed,
        ...saved,
        users: saved.users,
        requests: saved.requests ?? seed.requests,
        notifications: saved.notifications ?? seed.notifications,
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEY, state);
    applyTheme(state.theme);
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated || state.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [hydrated, state.theme]);

  const user = state.users.find((item) => item.id === state.sessionUserId) ?? null;
  const visibleNotices = state.notifications.filter(
    (notice) => notice.audience === "all" || notice.audience === user?.id,
  );
  const unreadCount = visibleNotices.filter((notice) => !notice.read).length;

  const pushToast = (title: string, body?: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((list) => [...list, { id, title, body }]);
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 3200);
  };

  const value: Store = {
    ...state,
    hydrated,
    user,
    toasts,
    unreadCount,
    visibleNotices,
    pushToast,
    dismissToast: (id) => setToasts((list) => list.filter((item) => item.id !== id)),
    markOnboarded: () => setState((current) => ({ ...current, onboarded: true })),
    continueAsGuest: () =>
      setState((current) => ({ ...current, guest: true, sessionUserId: null, onboarded: true })),
    login: (email, password) => {
      const found = state.users.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!found || found.password !== password) return { ok: false, reason: "invalid" };
      setState((current) => ({
        ...current,
        sessionUserId: found.id,
        guest: false,
        onboarded: true,
      }));
      return { ok: true };
    },
    register: (input) => {
      const email = input.email.trim().toLowerCase();
      const existing = state.users.find((item) => item.email.toLowerCase() === email);
      const profile = {
        ...input,
        email,
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        company: input.company?.trim() || undefined,
      };
      if (existing) {
        setState((current) => ({
          ...current,
          users: current.users.map((item) =>
            item.id === existing.id ? { ...item, ...profile } : item,
          ),
          sessionUserId: existing.id,
          guest: false,
          onboarded: true,
        }));
        return { ok: true as const };
      }
      const created: User = {
        ...profile,
        id: `u-${Date.now()}`,
      };
      setState((current) => ({
        ...current,
        users: [...current.users, created],
        sessionUserId: created.id,
        guest: false,
        onboarded: true,
      }));
      return { ok: true };
    },
    signInWith: (provider) => {
      const profile =
        provider === "apple"
          ? { fullName: "Jordan Blake", email: "jordan.apple@icloud.com", phone: "(407) 555-0104" }
          : { fullName: "Priya Shah", email: "priya.google@gmail.com", phone: "(407) 555-0172" };
      const existing = state.users.find((item) => item.email === profile.email);
      if (existing) {
        setState((current) => ({
          ...current,
          sessionUserId: existing.id,
          guest: false,
          onboarded: true,
        }));
        return;
      }
      const created: User = {
        id: `u-${provider}`,
        ...profile,
        password: `social-${provider}`,
        accountType: "individual",
      };
      setState((current) => ({
        ...current,
        users: [...current.users, created],
        sessionUserId: created.id,
        guest: false,
        onboarded: true,
      }));
    },
    logout: () => setState((current) => ({ ...current, sessionUserId: null, guest: false })),
    updateProfile: (patch) => {
      if (!user) return;
      setState((current) => ({
        ...current,
        users: current.users.map((item) => (item.id === user.id ? { ...item, ...patch } : item)),
      }));
    },
    resetPassword: (email, password) => {
      const found = state.users.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!found) return { ok: false, reason: "missing" };
      setState((current) => ({
        ...current,
        users: current.users.map((item) => (item.id === found.id ? { ...item, password } : item)),
      }));
      return { ok: true };
    },
    addRequest: (input) => {
      const created: TalentRequest = {
        ...input,
        id: `req-${Date.now()}`,
        userId: user?.id ?? null,
        reference: `RJR-${1800 + state.requests.length + 1}`,
        createdAt: new Date().toISOString(),
        status: "submitted",
      };
      const notice: Notice = {
        id: `n-${created.id}`,
        title: "Request received",
        body: `${created.reference} for your ${created.eventType.toLowerCase()} is with our team.`,
        time: "Just now",
        read: false,
        href: `/requests/${created.id}`,
        audience: user?.id ?? "all",
      };
      setState((current) => ({
        ...current,
        requests: [created, ...current.requests],
        notifications: [notice, ...current.notifications],
      }));
      return created;
    },
    setTheme: (theme) => setState((current) => ({ ...current, theme })),
    togglePref: (key) =>
      setState((current) => ({
        ...current,
        prefs: { ...current.prefs, [key]: !current.prefs[key] },
      })),
    markNotificationRead: (id) =>
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notice) =>
          notice.id === id ? { ...notice, read: true } : notice,
        ),
      })),
    markAllRead: () =>
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notice) =>
          notice.audience === "all" || notice.audience === user?.id
            ? { ...notice, read: true }
            : notice,
        ),
      })),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
