import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "../components/screens/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log In · RJR Talent" }] }),
  component: LoginScreen,
});
