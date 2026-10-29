import { createFileRoute } from "@tanstack/react-router";
import { RequestScreen } from "../components/screens/request";

export const Route = createFileRoute("/request")({
  head: () => ({ meta: [{ title: "Request Talent · RJR Talent" }] }),
  component: RequestScreen,
});
