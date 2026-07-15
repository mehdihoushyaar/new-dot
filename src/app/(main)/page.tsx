"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HomeFeed } from "@/widgets/home-feed";
import { PostComposer } from "@/features/posts/ui/PostComposer";

type Tab = "for-you" | "following";

export default function HomePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("for-you");

  return (
    <div>
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-zinc-800">
        <div className="flex">
          {(["for-you", "following"] as Tab[]).map((t_) => (
            <button
              key={t_}
              onClick={() => setTab(t_)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === t_ ? "text-white border-b-2 border-sky-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t(t_)}
            </button>
          ))}
        </div>
      </div>
      <PostComposer />
      <HomeFeed tab={tab} />
    </div>
  );
}
