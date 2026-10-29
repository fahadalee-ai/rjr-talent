import { createFileRoute } from "@tanstack/react-router";
import { RequestDetail } from "../../components/screens/profile";

export const Route = createFileRoute("/requests/$id")({
  head: () => ({ meta: [{ title: "Request · RJR Talent" }] }),
  component: function RequestDetailRoute() {
    const { id } = Route.useParams();
    return <RequestDetail id={id} />;
  },
});
