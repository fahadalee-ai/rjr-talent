import { createFileRoute } from "@tanstack/react-router";
import { LegalScreen } from "../components/screens/profile";

export const Route = createFileRoute("/legal")({
  head: () => ({ meta: [{ title: "Terms & Privacy · RJR Talent" }] }),
  component: LegalScreen,
});
