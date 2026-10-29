import logoUrl from "../img/logo.png";
import logoWhiteUrl from "../img/logo-w.png";
import logoWhiteClearUrl from "../img/logo-w-clear.png";
import favIconUrl from "../img/fav-icon.png";

const photos = import.meta.glob("../img/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const logo = logoUrl;
export const logoWhite = logoWhiteUrl;
export const logoWhiteClear = logoWhiteClearUrl;
export const favIcon = favIconUrl;

export function photo(name: string): string {
  const key = Object.keys(photos).find((path) => path.endsWith(`/${name}`));
  if (!key) return "";
  return photos[key] ?? "";
}
