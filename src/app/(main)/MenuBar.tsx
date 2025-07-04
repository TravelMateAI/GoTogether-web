import { validateRequestServer } from "@/auth";
import { Button } from "@/components/ui/button";
import { Bookmark, Home, Rss, ListChecks, Siren } from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequestServer();

  // if (!user) return null;

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline dark:text-slate-200">Home</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Feed"
        asChild
      >
        <Link href="/feed">
          <Rss />
          <span className="hidden lg:inline dark:text-slate-200">Feed</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline dark:text-slate-200">Bookmarks</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Planner"
        asChild
      >
        <Link href="/planner">
          <ListChecks />
          <span className="hidden lg:inline dark:text-slate-200">Planner</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Emergency"
        asChild
      >
        <Link href="/emergency">
          <Siren />
          <span className="hidden lg:inline dark:text-slate-200">Emergency</span>
        </Link>
      </Button>

      {/* Uncomment when ready
      <NotificationsButton initialState={{ unreadCount: unreadNotificationsCount }} />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      */}
    </div>
  );
}
