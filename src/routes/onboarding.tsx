import { createFileRoute } from "@tanstack/react-router";
import { OnboardingScreen } from "../components/screens/auth";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome · RJR Talent" }] }),
  component: OnboardingScreen,
});
