import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "../components/screens/home";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home · RJR Talent" }] }),
  component: HomeScreen,
});
