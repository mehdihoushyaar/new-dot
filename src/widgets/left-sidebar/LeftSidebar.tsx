"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/config/routes";
import { useAuthFlowStore } from "@/store/auth.store";
import { Avatar } from "@/shared/ui/avatar/Avatar";
import { useTotalUnreadCount } from "@/store/chat.store";
import { useNotificationStore } from "@/store/notification.store";

const navItems = [
  { href: ROUTES.HOME, label: "home", icon: "🏠" },
  { href: ROUTES.EXPLORE, label: "explore", icon: "🔍" },
  { href: ROUTES.NOTIFICATIONS(), label: "notifications", icon: "🔔" },
  { href: ROUTES.BOOKMARKS, label: "bookmarks", icon: "🔖" },
  { href: ROUTES.CHAT, label: "chat", icon: "💬" },
  { href: ROUTES.WALLET, label: "wallet", icon: "💰" },
  { href: ROUTES.SETTINGS, label: "settings", icon: "⚙️" },
];

export function LeftSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const user = useAuthFlowStore((s) => s.user);
  const unreadMessages = useTotalUnreadCount();
  const { unreadCount: unreadNotifs } = useNotificationStore();

  return (
    <aside className="sticky top-0 h-screen flex flex-col justify-between py-4 px-2 w-16 xl:w-64">
      <div>
        <Link href={ROUTES.HOME} className="flex items-center gap-3 px-3 py-2 mb-4">
          <span className="text-2xl font-black text-sky-500">●</span>
          <span className="hidden xl:block text-xl font-black text-white">MyDot</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            const badge =
              label === "chat" && unreadMessages > 0
                ? unreadMessages
                : label === "notifications" && unreadNotifs > 0
                ? unreadNotifs
                : null;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors hover:bg-zinc-800 ${isActive ? "font-bold text-white" : "text-zinc-400"}`}
              >
                <span className="relative text-xl">
                  {icon}
                  {badge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </span>
                <span className="hidden xl:block">{t(label)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {user && (
        <Link
          href={ROUTES.PROFILE(user.username)}
          className="flex items-center gap-3 px-3 py-3 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <Avatar src={user.avatar} alt={user.display_name} size="sm" />
          <div className="hidden xl:block min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.display_name}</p>
            <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
          </div>
        </Link>
      )}
    </aside>
  );
}
