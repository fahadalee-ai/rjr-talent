import { Link, useNavigate } from "@tanstack/react-router";
import { Image as ImageIcon, Pause, Play, Share2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActionSheet,
  Button,
  AppHeader,
  EmptyState,
  ErrorState,
  ScreenContainer,
  SearchField,
  Segmented,
  Sheet,
} from "../ios";
import { gallery, videos, type GalleryItem, type VideoItem } from "../../lib/content";
import { haptic } from "../../lib/haptics";
import { useApp } from "../../lib/store";

export function GalleryScreen() {
  const { pushToast } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const [query, setQuery] = useState("");
  const [photo, setPhoto] = useState<GalleryItem | null>(null);
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [menu, setMenu] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hold = useRef<number | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("rjr-gallery-tab") === "videos") setTab("videos");
    const timer = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  const photos = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return gallery.filter(
      (item) =>
        !needle || `${item.title} ${item.occasion} ${item.caption}`.toLowerCase().includes(needle),
    );
  }, [query]);

  const reels = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return videos.filter(
      (item) => !needle || `${item.title} ${item.caption}`.toLowerCase().includes(needle),
    );
  }, [query]);

  const refresh = () => {
    if (!navigator.onLine) {
      setError(true);
      setLoading(false);
      return;
    }
    setError(false);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 700);
  };

  const share = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard?.writeText(`${title}. ${text}`);
    pushToast("Copied", "Share text is on your clipboard.");
  };

  return (
    <ScreenContainer tab>
      <AppHeader title="Gallery" subtitle="Photos and performance highlights.">
        <div className="space-y-3">
          <SearchField value={query} onChange={setQuery} placeholder="Search events" />
          <Segmented
            ariaLabel="Gallery"
            value={tab}
            onChange={setTab}
            options={[
              { id: "photos", label: "Photos" },
              { id: "videos", label: "Videos" },
            ]}
          />
        </div>
      </AppHeader>
      {error ? (
        <ErrorState
          title="Couldn’t load the gallery"
          body="Check your connection and try again."
          onRetry={refresh}
        />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-2 px-4 pt-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-[16px] bg-separator/80" />
          ))}
        </div>
      ) : tab === "photos" ? (
        photos.length === 0 ? (
          <EmptyState icon={ImageIcon} title="No photos" body="Nothing matches that search." />
        ) : (
          <div className="grid grid-cols-2 gap-2 px-4 pt-4">
            {photos.map((item) => (
              <button
                key={item.id}
                type="button"
                className="overflow-hidden rounded-[16px] text-left"
                onClick={() => setPhoto(item)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  setMenu(item);
                }}
                onPointerDown={() => {
                  hold.current = window.setTimeout(() => setMenu(item), 480);
                }}
                onPointerUp={() => {
                  if (hold.current) window.clearTimeout(hold.current);
                }}
                onPointerLeave={() => {
                  if (hold.current) window.clearTimeout(hold.current);
                }}
              >
                <img src={item.src} alt={item.title} className="h-44 w-full object-cover" />
                <span className="block bg-card px-2 py-2 text-[13px] font-semibold">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        )
      ) : reels.length === 0 ? (
        <EmptyState icon={Play} title="No videos" body="Nothing matches that search." />
      ) : (
        <div className="space-y-3 px-4 pt-4">
          {reels.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setVideo(item)}
              className="block w-full overflow-hidden rounded-[16px] bg-card text-left shadow-[0_4px_16px_rgba(0,1,255,0.08)]"
            >
              <span className="relative block">
                <img src={item.src} alt="" className="h-44 w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <span className="grid size-10 place-items-center rounded-full bg-white/20 backdrop-blur">
                    <Play className="size-5 fill-white" />
                  </span>
                  <span className="text-[17px] font-semibold">{item.title}</span>
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-1 text-[12px] font-semibold text-white">
                  {item.duration}
                </span>
              </span>
              <span className="block px-3 py-3 text-[15px] text-secondary-text">
                {item.caption}
              </span>
            </button>
          ))}
        </div>
      )}

      <Sheet open={!!photo} onClose={() => setPhoto(null)} title={photo?.title}>
        {photo ? (
          <div>
            <img
              src={photo.src}
              alt={photo.title}
              className="max-h-[48dvh] w-full rounded-[16px] object-cover"
            />
            <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-secondary-text">
              {photo.occasion}
            </p>
            <p className="mt-1 text-[17px] leading-relaxed">{photo.caption}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  void share(photo.title, photo.caption);
                }}
              >
                <Share2 className="size-5" /> Share
              </Button>
              <Link
                to="/request"
                className="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-[17px] font-semibold text-white"
              >
                Request
              </Link>
            </div>
          </div>
        ) : null}
      </Sheet>

      <VideoPreview item={video} onClose={() => setVideo(null)} />

      <ActionSheet
        open={!!menu}
        onClose={() => setMenu(null)}
        title={menu?.title}
        message="Hold or right-click for actions"
        actions={[
          {
            label: "View",
            onClick: () => {
              if (menu) setPhoto(menu);
            },
          },
          {
            label: "Share",
            onClick: () => {
              if (menu) void share(menu.title, menu.caption);
            },
          },
          {
            label: "Request this look",
            onClick: () => navigate({ to: "/request" }),
          },
        ]}
      />
    </ScreenContainer>
  );
}

function VideoPreview({ item, onClose }: { item: VideoItem | null; onClose: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setPlaying(true);
    setProgress(0);
  }, [item?.id]);

  useEffect(() => {
    if (!item || !playing) return;
    const timer = window.setInterval(() => {
      setProgress((value) => (value >= 100 ? 0 : value + 1));
    }, 80);
    return () => window.clearInterval(timer);
  }, [item, playing]);

  return (
    <Sheet open={!!item} onClose={onClose} title={item?.title}>
      {item ? (
        <div>
          <div className="relative overflow-hidden rounded-[16px] bg-black">
            <img
              src={item.src}
              alt=""
              className={
                playing ? "animate-ken h-52 w-full object-cover" : "h-52 w-full object-cover"
              }
            />
            <button
              type="button"
              aria-label={playing ? "Pause preview" : "Play preview"}
              onClick={() => {
                haptic("tap");
                setPlaying((value) => !value);
              }}
              className="absolute bottom-3 left-3 grid size-11 place-items-center rounded-full bg-black/50 text-white"
            >
              {playing ? <Pause className="size-5" /> : <Play className="size-5 fill-white" />}
            </button>
            <span className="absolute bottom-3 right-3 text-[12px] font-semibold text-white">
              {item.duration}
            </span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-separator">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-secondary-text">{item.caption}</p>
          <p className="mt-1 text-[12px] text-secondary-text">Visual highlight preview</p>
          <div className="mt-4">
            <Link
              to="/talent/$slug"
              params={{ slug: item.talent }}
              className="flex h-[52px] items-center justify-center rounded-[14px] bg-primary text-[17px] font-semibold text-white"
            >
              Request this act
            </Link>
          </div>
        </div>
      ) : null}
    </Sheet>
  );
}
