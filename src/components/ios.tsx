import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  House,
  Image as ImageIcon,
  Plus,
  Search,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { haptic } from "../lib/haptics";
import { logo } from "../lib/images";
import { cn } from "../lib/utils";

const ChromeContext = createContext({ scrolled: false });

export function SafeTop() {
  return <div className="status-bar shrink-0" />;
}

export function AppHeader({
  title,
  trailing,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
  large?: boolean;
}) {
  const { scrolled } = useContext(ChromeContext);
  const showBar = scrolled || Boolean(eyebrow) || Boolean(trailing);
  return (
    <header
      className={cn(
        "z-30 shrink-0 bg-black text-white",
        scrolled && "border-b-[0.5px] border-white/25",
      )}
    >
      <div className="status-bar" />
      {showBar ? (
        <div className="nav-bar relative flex items-center gap-2 px-2">
          <div className="flex min-w-0 flex-1 items-center">{eyebrow}</div>
          <h1
            className={cn(
              "pointer-events-none absolute inset-x-16 truncate text-center text-[17px] font-semibold leading-[1.3] transition-opacity duration-150",
              scrolled ? "opacity-100" : "opacity-0",
            )}
          >
            {title}
          </h1>
          {trailing ? <div className="flex shrink-0 items-center">{trailing}</div> : null}
        </div>
      ) : null}
    </header>
  );
}

export function BackButton({
  overlay = false,
  label = "Back",
  onClick,
}: {
  overlay?: boolean;
  label?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 min-w-11 items-center gap-0.5 px-1 text-[17px] transition-opacity duration-150",
        overlay ? "bg-black/45 text-white" : "text-white",
      )}
    >
      <ChevronLeft className="ios-only size-[22px]" />
      <ArrowLeft className="android-only size-6" />
      <span className="ios-only">{label}</span>
    </button>
  );
}

export function Logo({ height = 44, className }: { height?: number; className?: string }) {
  return (
    <img
      src={logo}
      alt="RJR Talent"
      style={{ height }}
      className={cn("w-auto rounded-[12px] bg-black object-contain", className)}
    />
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "white";
}) {
  return (
    <button
      type={type}
      onPointerDown={() => {
        if (!props.disabled) haptic("tap");
      }}
      className={cn(
        "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] px-4 text-[17px] font-semibold transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" && "bg-primary text-white active:bg-primary-pressed",
        variant === "secondary" && "bg-tint text-primary",
        variant === "tertiary" && "h-11 bg-transparent text-primary",
        variant === "destructive" && "bg-transparent text-danger",
        variant === "white" && "bg-white text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextField({
  label,
  error,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const fieldId = id ?? props.name ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1.5 block text-[15px] font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          className={cn(
            "h-[52px] w-full rounded-[12px] bg-card px-4 text-[17px] text-foreground outline-none ring-1 ring-separator placeholder:text-secondary-text focus:ring-2 focus:ring-primary",
            typeof props.value === "string" && props.value.length > 0 && "pr-12",
            error && "ring-danger focus:ring-danger",
          )}
          {...props}
        />
        {typeof props.value === "string" && props.value.length > 0 && !props.readOnly ? (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-secondary-text"
            onClick={() => {
              const input = document.getElementById(fieldId);
              if (!(input instanceof HTMLInputElement)) return;
              const setter = Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                "value",
              )?.set;
              setter?.call(input, "");
              input.dispatchEvent(new Event("input", { bubbles: true }));
            }}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1.5 text-[15px] text-danger">{error}</p> : null}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex h-11 rounded-[10px] bg-muted p-0.5 dark:bg-[#1c1c1e]"
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => {
              haptic("tap");
              onChange(option.id);
            }}
            className={cn(
              "flex-1 rounded-[8px] px-2 text-[13px] font-semibold transition duration-200",
              selected ? "bg-card text-foreground shadow-sm" : "text-secondary-text",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex h-12 items-center gap-2 rounded-[12px] bg-card px-3 ring-1 ring-separator">
      <Search className="size-5 text-secondary-text" aria-hidden />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-secondary-text"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="grid size-11 place-items-center"
        >
          <X className="size-4 text-secondary-text" />
        </button>
      ) : null}
    </label>
  );
}

export function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3" aria-label={label}>
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => {
          haptic("tap");
          onChange(Math.max(min, value - step));
        }}
        className="grid size-11 place-items-center rounded-full bg-tint text-[22px] font-medium text-primary disabled:opacity-40"
      >
        −
      </button>
      <span className="min-w-10 text-center text-[17px] font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => {
          haptic("tap");
          onChange(Math.min(max, value + step));
        }}
        className="grid size-11 place-items-center rounded-full bg-tint text-[22px] font-medium text-primary disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => {
        haptic("tap");
        onChange(!checked);
      }}
      className={cn(
        "relative h-[31px] w-[51px] shrink-0 rounded-full p-[2px] transition duration-200",
        checked ? "bg-success" : "bg-[#e5e5ea] dark:bg-[#39393d]",
      )}
    >
      <span
        className={cn(
          "block size-[27px] rounded-full bg-white shadow transition duration-200",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="presentation">
      <button
        type="button"
        aria-label="Dismiss"
        className="animate-fade absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="screen-scroll animate-sheet relative max-h-[88dvh] w-full max-w-[430px] rounded-t-[16px] bg-card px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2 shadow-[0_1px_2px_rgba(11,11,26,0.12)]"
      >
        <div className="mx-auto mb-3 h-[5px] w-9 rounded-full bg-separator" />
        {title ? <h2 className="mb-3 text-[22px] font-semibold">{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}

export function ActionSheet({
  open,
  onClose,
  title,
  message,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions: { label: string; destructive?: boolean; onClick: () => void }[];
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <button
        type="button"
        aria-label="Dismiss"
        className="animate-fade absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="animate-sheet relative w-full max-w-[400px]">
        <div className="overflow-hidden rounded-[14px] bg-card/95 text-center backdrop-blur-xl">
          {title ? <p className="px-4 pt-3 text-[15px] font-semibold">{title}</p> : null}
          {message ? (
            <p className="px-4 pb-2 pt-1 text-[13px] text-secondary-text">{message}</p>
          ) : null}
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                haptic("tap");
                action.onClick();
                onClose();
              }}
              className={cn(
                "flex h-11 w-full items-center justify-center border-t border-separator text-[17px]",
                action.destructive ? "font-semibold text-danger" : "text-primary",
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-[14px] bg-card text-[17px] font-semibold text-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function AlertCard({
  open,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel,
  destructive = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-8">
      <button
        type="button"
        aria-label="Dismiss"
        className="animate-fade absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        className="animate-pop relative w-full max-w-[300px] overflow-hidden rounded-[16px] bg-card text-center shadow-2xl"
      >
        <div className="px-4 pb-4 pt-5">
          <h2 className="text-[17px] font-semibold">{title}</h2>
          {message ? (
            <p className="mt-1 text-[15px] leading-snug text-secondary-text">{message}</p>
          ) : null}
        </div>
        <div className="flex border-t border-separator">
          {cancelLabel ? (
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 text-[17px] text-primary"
            >
              {cancelLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={cn(
              "h-11 flex-1 border-l border-separator text-[17px] font-semibold",
              destructive ? "text-danger" : "text-primary",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LargeTitle({
  title,
  subtitle,
  inverted = false,
}: {
  title: string;
  subtitle?: string;
  inverted?: boolean;
}) {
  return (
    <div className={cn("px-4 pb-4 pt-4", inverted && "bg-black text-white")}>
      <h1 className="text-[34px] font-bold leading-[1.2] tracking-tight">{title}</h1>
      {subtitle ? (
        <p
          className={cn(
            "mt-2 text-[15px] leading-[1.4]",
            inverted ? "text-white/70" : "text-secondary-text",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function NavBar({
  title,
  backTo = "/home",
  right,
  overlay = false,
}: {
  title?: string;
  backTo?: RowTo;
  right?: ReactNode;
  overlay?: boolean;
}) {
  const router = useRouter();
  const { scrolled } = useContext(ChromeContext);
  const goBack = () => {
    haptic("tap");
    if (window.history.length > 1) router.history.back();
    else if (backTo) router.navigate({ to: backTo });
  };
  return (
    <header
      className={cn(
        "z-30 shrink-0",
        overlay ? "bg-transparent" : "bg-black text-white",
        !overlay && scrolled && "border-b-[0.5px] border-white/25",
      )}
    >
      <div className="status-bar" />
      <div className="nav-bar relative flex items-center px-1">
        <BackButton overlay={overlay} onClick={goBack} />
        <h1 className="pointer-events-none absolute inset-x-16 truncate text-center text-[17px] font-semibold leading-[1.3] text-white">
          {title}
        </h1>
        <div className="ml-auto flex min-h-11 min-w-11 items-center justify-end pr-1">{right}</div>
      </div>
    </header>
  );
}

export function SectionHeader({
  title,
  action,
  to,
}: {
  title: string;
  action?: string;
  to?: "/services" | "/gallery" | "/contact";
}) {
  return (
    <div className="mb-2 flex items-end justify-between px-4">
      <h2 className="text-[22px] font-semibold tracking-tight">{title}</h2>
      {action && to ? (
        <Link
          to={to}
          className="text-[15px] font-semibold text-primary"
          onClick={() => haptic("tap")}
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-4 rounded-[16px] border border-separator bg-card px-4 py-8 text-center shadow-[0_1px_2px_rgba(11,11,26,0.06)]">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-tint text-primary">
        <Icon className="size-7" />
      </div>
      <h2 className="mt-4 text-[22px] font-semibold">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-secondary-text">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  body,
  onRetry,
}: {
  title: string;
  body: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-4 rounded-[16px] border border-separator bg-card px-4 py-8 text-center shadow-[0_1px_2px_rgba(11,11,26,0.06)]">
      <h2 className="text-[22px] font-semibold">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-secondary-text">{body}</p>
      <div className="mt-5">
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[12px] bg-separator/80", className)} />;
}

const tabs = [
  { to: "/home", label: "Home", icon: House },
  { to: "/services", label: "Services", icon: Sparkles },
  { to: "/request", label: "Request", icon: Plus },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomTabBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <nav className="tab-bar z-40 shrink-0 border-t-[0.5px] border-separator bg-white/92 backdrop-blur-xl dark:bg-black/92">
      <div className="tab-bar-row">
        {tabs.map((tab) => {
          const active = pathname === tab.to || pathname.startsWith(`${tab.to}/`);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              onClick={() => {
                haptic("tap");
                if (tab.to === "/request") sessionStorage.removeItem("rjr-prefill");
                if (tab.to === "/gallery") sessionStorage.setItem("rjr-gallery-tab", "photos");
              }}
              aria-current={active ? "page" : undefined}
              className="tab-item flex min-h-11 flex-col items-center justify-center gap-1 transition-opacity duration-150"
            >
              <span className="relative grid size-6 place-items-center">
                <span className="android-pill" />
                <Icon
                  className={cn("size-6", active ? "text-primary" : "text-secondary-text")}
                  strokeWidth={active ? 2.5 : 2}
                />
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium leading-none",
                  active ? "text-primary" : "text-secondary-text",
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export const TabBar = BottomTabBar;

function isChrome(child: ReactNode) {
  if (!isValidElement(child)) return false;
  if (child.type === AppHeader || child.type === NavBar) return true;
  const props = child.props as { "data-chrome"?: boolean | string };
  return props["data-chrome"] != null && props["data-chrome"] !== false;
}

export function ScreenContainer({
  children,
  tab = false,
  className,
}: {
  children: ReactNode;
  tab?: boolean;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const chrome: ReactNode[] = [];
  const body: ReactNode[] = [];
  let overlay = false;

  Children.forEach(children, (child, index) => {
    if (!isChrome(child)) {
      body.push(child);
      return;
    }
    chrome.push(child);
    if (!isValidElement(child)) return;
    if (child.type === NavBar && (child.props as { overlay?: boolean }).overlay) overlay = true;
    if (child.type !== AppHeader) return;
    const props = child.props as {
      title?: string;
      subtitle?: string;
      large?: boolean;
      children?: ReactNode;
    };
    if (props.large !== false && props.title) {
      body.unshift(
        <LargeTitle
          key={`large-${index}`}
          inverted
          title={props.title}
          subtitle={props.subtitle}
        />,
      );
    }
    if (props.children) {
      body.push(
        <div key={`tools-${index}`} className="px-4 pb-3">
          {props.children}
        </div>,
      );
    }
    chrome[chrome.length - 1] = cloneElement(child as ReactElement<{ children?: ReactNode }>, {
      children: null,
    });
  });

  return (
    <ChromeContext.Provider value={{ scrolled }}>
      <div className={cn("screen-shell relative bg-grouped text-foreground", className)}>
        {overlay ? null : chrome}
        <div
          className={cn("screen-scroll", chrome.length === 0 && "pad-status")}
          onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 8)}
        >
          {body}
          <div className="h-6" />
        </div>
        {overlay ? <div className="absolute inset-x-0 top-0 z-30">{chrome}</div> : null}
        {tab ? <BottomTabBar /> : null}
      </div>
    </ChromeContext.Provider>
  );
}

export const Page = ScreenContainer;

type RowTo =
  | "/home"
  | "/services"
  | "/request"
  | "/gallery"
  | "/profile"
  | "/notifications"
  | "/contact"
  | "/about"
  | "/legal"
  | "/requests"
  | "/login"
  | "/register"
  | "/forgot";

export function Row({
  icon: Icon,
  label,
  value,
  onClick,
  to,
  destructive = false,
  last = false,
}: {
  icon?: LucideIcon;
  label: string;
  value?: string;
  onClick?: () => void;
  to?: RowTo;
  destructive?: boolean;
  last?: boolean;
}) {
  const inner = (
    <>
      {Icon ? (
        <Icon className={cn("size-6", destructive ? "text-danger" : "text-primary")} />
      ) : null}
      <span className={cn("flex-1 text-left text-[17px]", destructive && "text-danger")}>
        {label}
      </span>
      {value ? (
        <span className="max-w-[46%] truncate text-[15px] text-secondary-text">{value}</span>
      ) : null}
      {to || onClick ? <ChevronRight className="size-5 text-secondary-text" /> : null}
    </>
  );
  const className = cn(
    "flex min-h-14 w-full items-center gap-2 px-4 text-left transition-opacity duration-150",
    !last && "border-b border-separator",
  );
  if (to) {
    return (
      <Link to={to} className={className} onClick={() => haptic("tap")}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-separator bg-card shadow-[0_1px_2px_rgba(11,11,26,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="text-[14px] text-star">
          ★
        </span>
      ))}
    </div>
  );
}

export function formatWhen(date: string, time: string) {
  const parsed = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const ListItem = Row;
export const Input = TextField;

export function statusLabel(status: "submitted" | "reviewing" | "confirmed") {
  if (status === "submitted") return "Submitted";
  if (status === "reviewing") return "In review";
  return "Confirmed";
}
