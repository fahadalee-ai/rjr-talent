import { createFileRoute } from "@tanstack/react-router";
import { SplashScreen } from "../components/screens/auth";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "RJR Talent" }] }),
  component: SplashScreen,
});
