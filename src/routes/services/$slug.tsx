import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "../../components/screens/catalog";

export const Route = createFileRoute("/services/$slug")({
  head: () => ({ meta: [{ title: "Service · RJR Talent" }] }),
  component: function ServiceRoute() {
    const { slug } = Route.useParams();
    return <ServiceDetail slug={slug} />;
  },
});
