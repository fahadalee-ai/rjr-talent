import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ServicesScreen } from "../components/screens/catalog";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Services · RJR Talent" }] }),
  component: ServicesLayout,
});

function ServicesLayout() {
  const isDetail = useRouterState({
    select: (state) => state.location.pathname.startsWith("/services/"),
  });
  if (isDetail) return <Outlet />;
  return <ServicesScreen />;
}
