import { createFileRoute } from "@tanstack/react-router";
import { ForgotScreen } from "../components/screens/auth";

export const Route = createFileRoute("/forgot")({
  head: () => ({ meta: [{ title: "Reset Password · RJR Talent" }] }),
  component: ForgotScreen,
});
