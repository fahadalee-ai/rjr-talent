import { createFileRoute } from "@tanstack/react-router";
import { RequestsScreen } from "../components/screens/profile";

export const Route = createFileRoute("/requests")({
  head: () => ({ meta: [{ title: "My Requests · RJR Talent" }] }),
  component: RequestsScreen,
});
