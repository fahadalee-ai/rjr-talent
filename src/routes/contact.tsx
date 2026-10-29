import { createFileRoute } from "@tanstack/react-router";
import { ContactScreen } from "../components/screens/profile";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact · RJR Talent" }] }),
  component: ContactScreen,
});
