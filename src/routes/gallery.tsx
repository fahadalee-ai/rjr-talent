import { createFileRoute } from "@tanstack/react-router";
import { GalleryScreen } from "../components/screens/gallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Gallery · RJR Talent" }] }),
  component: GalleryScreen,
});
