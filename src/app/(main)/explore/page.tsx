"use client";
import { useTranslation } from "react-i18next";

export default function ExplorePage() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <h1 className="text-xl font-bold text-white">{t("explore")}</h1>
      </div>
      <div className="p-4">
        <input
          placeholder="Search MyDot"
          className="w-full rounded-full bg-zinc-800 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </div>
  );
}
