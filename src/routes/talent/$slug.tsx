import { createFileRoute } from "@tanstack/react-router";
import { TalentDetail } from "../../components/screens/catalog";

export const Route = createFileRoute("/talent/$slug")({
  head: () => ({ meta: [{ title: "Talent · RJR Talent" }] }),
  component: function TalentRoute() {
    const { slug } = Route.useParams();
    return <TalentDetail slug={slug} />;
  },
});
