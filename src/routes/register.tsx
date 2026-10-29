import { createFileRoute } from "@tanstack/react-router";
import { RegisterScreen } from "../components/screens/auth";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account · RJR Talent" }] }),
  component: RegisterScreen,
});
