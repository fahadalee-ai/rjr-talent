export function haptic(kind: "tap" | "success" | "error" = "tap") {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  if (kind === "success") navigator.vibrate([12, 40, 16]);
  else if (kind === "error") navigator.vibrate([20, 30, 20]);
  else navigator.vibrate(10);
}
