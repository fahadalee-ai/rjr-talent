import { createFileRoute } from "@tanstack/react-router";
import { NotificationsScreen } from "../components/screens/profile";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · RJR Talent" }] }),
  component: NotificationsScreen,
});
