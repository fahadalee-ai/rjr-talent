import { createFileRoute } from "@tanstack/react-router";
import { ServicesScreen } from "../components/screens/catalog";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Services · RJR Talent" }] }),
  component: ServicesScreen,
});
