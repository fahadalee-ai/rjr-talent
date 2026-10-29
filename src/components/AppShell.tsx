import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useApp } from "../lib/store";
import { cn } from "../lib/utils";

const tabRoots = new Set(["/home", "/services", "/request", "/gallery", "/profile"]);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { toasts, dismissToast } = useApp();
  const stack = useRef<string[]>([]);
  const [motion, setMotion] = useState<"push" | "pop" | "none">("none");

  useEffect(() => {
    document.documentElement.classList.toggle("android", /Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const previous = stack.current;
    const last = previous[previous.length - 1];
    if (last === pathname) return;
    const backIndex = previous.lastIndexOf(pathname);
    if (backIndex >= 0 && backIndex < previous.length - 1) {
      stack.current = previous.slice(0, backIndex + 1);
      setMotion("pop");
      return;
    }
    const switchingTabs = Boolean(last && tabRoots.has(last) && tabRoots.has(pathname));
    setMotion(last && !switchingTabs ? "push" : "none");
    stack.current = [...previous, pathname];
  }, [pathname]);

  useEffect(() => {
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      window.setTimeout(() => {
        target.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 280);
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, []);

  useEffect(() => {
    let startX = 0;
    let tracking = false;
    const down = (event: PointerEvent) => {
      if (event.clientX > 24) return;
      tracking = true;
      startX = event.clientX;
    };
    const up = (event: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      if (event.clientX - startX < 72) return;
      if (tabRoots.has(window.location.pathname)) return;
      if (window.history.length > 1) window.history.back();
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="app-frame bg-[#d8d8de] dark:bg-black">
      <div
        key={pathname}
        className={cn(
          "app-screen bg-grouped",
          motion === "push" && "motion-push",
          motion === "pop" && "motion-pop",
        )}
      >
        {children}
      </div>
      <div
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4"
        style={{
          bottom: tabRoots.has(pathname)
            ? "calc(var(--tab-bar) + max(var(--tab-inset), env(safe-area-inset-bottom, 0px)) + 8px)"
            : "calc(max(var(--tab-inset), env(safe-area-inset-bottom, 0px)) + 16px)",
        }}
      >
        <div className="w-full max-w-[398px] space-y-2">
          {toasts.map((toast) => (
            <button
              key={toast.id}
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="pointer-events-auto flex min-h-12 w-full items-center rounded-[12px] bg-card px-4 text-left shadow-[0_1px_2px_rgba(11,11,26,0.12)] ring-1 ring-separator"
            >
              <span>
                <p className="text-[15px] font-semibold leading-[1.3]">{toast.title}</p>
                {toast.body ? (
                  <p className="text-[13px] leading-[1.4] text-secondary-text">{toast.body}</p>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
