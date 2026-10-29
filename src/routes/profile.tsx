import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "../components/screens/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · RJR Talent" }] }),
  component: ProfileScreen,
});
