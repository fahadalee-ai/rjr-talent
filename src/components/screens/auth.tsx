import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, Input } from "../ios";
import { onboarding, splashImage, TAGLINE } from "../../lib/content";
import { logoWhite, logoWhiteClear } from "../../lib/images";
import { haptic } from "../../lib/haptics";
import { useApp } from "../../lib/store";
import { cn } from "../../lib/utils";

function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="screen-scroll h-full bg-background">
      <header className="bg-black px-4 pb-8 text-white">
        <div className="status-bar" />
        <img src={logoWhite} alt="RJR Talent" className="h-[72px] w-auto bg-black" />
        <h1 className="mt-6 text-[34px] font-bold leading-[1.1] tracking-tight">{title}</h1>
        <p className="mt-2 max-w-[20rem] text-[17px] leading-snug text-white/80">{subtitle}</p>
      </header>
      <div className="px-4 py-6">{children}</div>
    </div>
  );
}

export function SplashScreen() {
  const navigate = useNavigate();
  const { hydrated } = useApp();

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      navigate({ to: "/onboarding", replace: true });
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [hydrated, navigate]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#0001FF] text-white">
      <img
        src={splashImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0001FF]/30 via-[#0001FF]/55 to-[#00007A]" />
      <div
        className="pointer-events-none absolute -left-16 top-10 h-72 w-40 rotate-12 bg-white/20 blur-3xl"
        style={{ animation: "beam 4.5s ease-in-out infinite" }}
      />
      <div className="pointer-events-none absolute -right-10 bottom-24 h-64 w-36 -rotate-12 bg-white/15 blur-3xl" />
      <div className="relative z-10 flex flex-col items-center px-8">
        <img src={logoWhiteClear} alt="RJR Talent" className="animate-pop h-40 w-auto" />
        <div className="mt-8 flex h-8 items-end gap-1.5" aria-hidden>
          {[0, 1, 2, 3, 4].map((bar) => (
            <span
              key={bar}
              className="w-1 origin-bottom rounded-full bg-white/80"
              style={{
                height: 10 + (bar % 3) * 8,
                animation: "wave 0.9s ease-in-out infinite",
                animationDelay: `${bar * 0.12}s`,
              }}
            />
          ))}
        </div>
        <p className="animate-rise delay-1 mt-6 max-w-[280px] text-center text-[17px] font-medium leading-snug text-white">
          {TAGLINE}
        </p>
      </div>
    </div>
  );
}

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { markOnboarded, continueAsGuest } = useApp();
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const slide = onboarding[index] ?? onboarding[0];
  const last = index === onboarding.length - 1;

  const finish = (dest: "register" | "guest" | "login") => {
    haptic("tap");
    markOnboarded();
    if (dest === "guest") {
      continueAsGuest();
      navigate({ to: "/home", replace: true });
      return;
    }
    navigate({ to: dest === "register" ? "/register" : "/login", replace: true });
  };

  return (
    <div
      className="relative h-full min-h-0 bg-black"
      onPointerDown={(event) => {
        startX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (startX.current == null) return;
        const delta = event.clientX - startX.current;
        startX.current = null;
        if (delta < -48 && index < onboarding.length - 1) setIndex(index + 1);
        if (delta > 48 && index > 0) setIndex(index - 1);
      }}
    >
      <img
        key={slide.image}
        src={slide.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/25" />
      <button
        type="button"
        onClick={() => finish("login")}
        className="absolute right-4 z-10 bg-black/55 px-4 py-2 text-[17px] font-semibold text-white"
        style={{ top: "calc(max(var(--status-bar), env(safe-area-inset-top, 0px)) + 8px)" }}
      >
        Skip
      </button>
      <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <div className="mb-5 flex gap-2">
          {onboarding.map((item, dot) => (
            <span
              key={item.title}
              className={cn("h-1 flex-1", dot === index ? "bg-white" : "bg-white/35")}
            />
          ))}
        </div>
        <h1 className="text-[34px] font-bold leading-[1.12] tracking-tight text-white">
          {slide.title}
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-white">{slide.body}</p>
        <div className="mt-6">
          <Button onClick={() => (last ? finish("login") : setIndex(index + 1))}>
            {last ? "Get Started" : "Next"}
          </Button>
        </div>
        {last ? (
          <button
            type="button"
            onClick={() => finish("guest")}
            className="mt-3 h-11 text-[17px] font-semibold text-white"
          >
            Continue as Guest
          </button>
        ) : (
          <div className="h-11" />
        )}
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  name,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        label={label}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-3 top-[38px] grid size-11 place-items-center text-secondary-text"
      >
        {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}

function SocialButtons({ onApple, onGoogle }: { onApple: () => void; onGoogle: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-separator" />
        <span className="text-[15px] text-secondary-text">or</span>
        <span className="h-px flex-1 bg-separator" />
      </div>
      <button
        type="button"
        onClick={onApple}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-black text-[17px] font-semibold text-white"
      >
        <AppleMark />
        Sign in with Apple
      </button>
      <button
        type="button"
        onClick={onGoogle}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-card text-[17px] font-semibold ring-1 ring-separator"
      >
        <span className="grid size-5 place-items-center rounded-full bg-tint text-[13px] font-bold text-primary">
          G
        </span>
        Continue with Google
      </button>
    </div>
  );
}

function AppleMark() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden fill="currentColor">
      <path d="M13.1 9.5c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8s-1.7-.8-2.9-.8c-1.5 0-2.8.9-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.9.7 1.9-1.1 2.6-2.2c.8-1.2 1.2-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.6zM11 3.2c.6-.7 1-1.7.9-2.7-1 .1-2.1.6-2.8 1.4-.6.7-1.1 1.7-.9 2.6 1 .1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, signInWith, continueAsGuest, pushToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    const result = login(email, password);
    if (!result.ok) return;
    haptic("success");
    pushToast("Welcome back");
    navigate({ to: "/home", replace: true });
  };

  return (
    <AuthFrame title="Welcome Back" subtitle="Log in to manage your event requests.">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        <div className="flex justify-end">
          <Link to="/forgot" className="text-[15px] font-semibold text-primary">
            Forgot Password?
          </Link>
        </div>
        <Button type="submit">Log In</Button>
      </form>
      <div className="mt-6">
        <SocialButtons
          onApple={() => {
            signInWith("apple");
            pushToast("Signed in with Apple");
            navigate({ to: "/home", replace: true });
          }}
          onGoogle={() => {
            signInWith("google");
            pushToast("Signed in with Google");
            navigate({ to: "/home", replace: true });
          }}
        />
      </div>
      <p className="mt-8 text-center text-[17px] text-secondary-text">
        Don’t have an account?{" "}
        <Link to="/register" className="font-semibold text-primary">
          Register
        </Link>
      </p>
      <button
        type="button"
        onClick={() => {
          continueAsGuest();
          navigate({ to: "/home", replace: true });
        }}
        className="mt-1 h-11 w-full text-[17px] font-semibold text-primary"
      >
        Continue as Guest
      </button>
    </AuthFrame>
  );
}

export function RegisterScreen() {
  const navigate = useNavigate();
  const { register, signInWith, pushToast } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "business">("individual");
  const [company, setCompany] = useState("");
  const [agreed, setAgreed] = useState(false);

  const submit = () => {
    register({
      fullName,
      email,
      phone,
      password,
      accountType,
      company: accountType === "business" ? company : undefined,
    });
    haptic("success");
    pushToast("Account created", "You can request talent anytime.");
    navigate({ to: "/home", replace: true });
  };

  return (
    <AuthFrame title="Create Your Account" subtitle="Book entertainment for your next live event.">
      <form
        noValidate
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Input
          label="Full Name"
          name="name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Phone Number"
          name="tel"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div>
          <p className="mb-1.5 text-[15px] font-medium">I’m booking as</p>
          <div className="grid grid-cols-2 gap-2 rounded-[12px] bg-grouped p-1">
            {(["individual", "business"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAccountType(option)}
                className={cn(
                  "h-11 rounded-[10px] text-[15px] font-semibold capitalize",
                  accountType === option ? "bg-card text-primary shadow-sm" : "text-secondary-text",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {accountType === "business" ? (
          <Input
            label="Company Name"
            name="organization"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        ) : null}
        <PasswordField
          label="Password"
          name="new-password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <PasswordField
          label="Confirm Password"
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />
        <label className="flex items-start gap-3 py-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-1 size-5 accent-[#0001FF]"
          />
          <span className="text-[15px] leading-snug">
            I agree to the{" "}
            <Link to="/legal" className="font-semibold text-primary">
              Terms & Privacy Policy
            </Link>
          </span>
        </label>
        <Button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          Create Account
        </Button>
      </form>
      <div className="mt-6">
        <SocialButtons
          onApple={() => {
            signInWith("apple");
            navigate({ to: "/home", replace: true });
          }}
          onGoogle={() => {
            signInWith("google");
            navigate({ to: "/home", replace: true });
          }}
        />
      </div>
      <p className="mt-8 text-center text-[17px]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Log In
        </Link>
      </p>
    </AuthFrame>
  );
}

export function ForgotScreen() {
  const navigate = useNavigate();
  const { resetPassword } = useApp();
  const [step, setStep] = useState<"email" | "sent" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <AuthFrame
      title={step === "reset" || step === "done" ? "New Password" : "Reset Password"}
      subtitle={
        step === "sent"
          ? "You can set a new password now."
          : step === "reset"
            ? "Choose a new password for your account."
            : step === "done"
              ? "You can log in with your new password."
              : "Enter your email and continue."
      }
    >
      <button
        type="button"
        onClick={() => navigate({ to: "/login" })}
        className="mb-4 text-[17px] font-medium text-primary"
      >
        Cancel
      </button>
      {step === "email" ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setStep("sent");
          }}
        >
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Send Reset Link</Button>
        </form>
      ) : null}
      {step === "sent" ? (
        <div>
          <p className="text-[17px] leading-relaxed">
            If an account exists for {email || "that email"}, continue to choose a new password.
          </p>
          <div className="mt-6">
            <Button onClick={() => setStep("reset")}>Continue</Button>
          </div>
        </div>
      ) : null}
      {step === "reset" ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            resetPassword(email, password);
            haptic("success");
            setStep("done");
          }}
        >
          <PasswordField
            label="New Password"
            name="new-password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
          />
          <PasswordField
            label="Confirm Password"
            name="confirm"
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
          />
          <Button type="submit">Update Password</Button>
        </form>
      ) : null}
      {step === "done" ? (
        <Button onClick={() => navigate({ to: "/login", replace: true })}>Back to Login</Button>
      ) : null}
    </AuthFrame>
  );
}
