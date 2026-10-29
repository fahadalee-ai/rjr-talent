import { createFileRoute } from "@tanstack/react-router";
import { AboutScreen } from "../components/screens/profile";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About · RJR Talent" }] }),
  component: AboutScreen,
});
