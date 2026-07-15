"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

const settingsLinks = [
  { href: ROUTES.SETTINGS_PROFILE, label: "Profile" },
  { href: ROUTES.SETTINGS_ACCOUNT, label: "Account" },
  { href: ROUTES.SETTINGS_SECURITY, label: "Security & 2FA" },
  { href: ROUTES.SETTINGS_NOTIFICATIONS, label: "Notifications" },
  { href: ROUTES.SETTINGS_PRIVACY, label: "Privacy" },
];

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <h1 className="text-xl font-bold text-white">{t("settings")}</h1>
      </div>
      <nav className="divide-y divide-zinc-800">
        {settingsLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between px-4 py-4 hover:bg-zinc-900 transition-colors"
          >
            <span className="text-white">{label}</span>
            <span className="text-zinc-500">›</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
