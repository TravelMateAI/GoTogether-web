import UserAvatar from "@/components/UserAvatar";
import { NotificationData, NotificationType } from "@/lib/types"; // Corrected import for NotificationType
import { cn } from "@/lib/utils";
// import { NotificationType } from "@prisma/client"; // Removed incorrect import
import { Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} followed you`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.post?.id}`, // Use optional chaining for notification.post.id
    },
    LIKE: {
      message: `${notification.issuer.displayName} liked your post`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.post?.id}`, // Use optional chaining for notification.post.id
    },
    // It's good practice to handle all enum members or have a default
    MENTION: { // Assuming MENTION is a valid NotificationType from your types
      message: `${notification.issuer.displayName} mentioned you`,
      icon: <MessageCircle className="size-7 text-blue-500" />, // Example icon
      href: notification.post?.id ? `/posts/${notification.post.id}` : `/users/${notification.issuer.username}`, // Example href
    }
  };

  const typeSpecifics = notificationTypeMap[notification.type];
  if (!typeSpecifics) {
    // Handle unknown notification type if necessary, or ensure notificationTypeMap covers all NotificationType values
    console.warn("Unknown notification type:", notification.type);
    return null; // Or some fallback UI
  }
  const { message, icon, href } = typeSpecifics;

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.isRead && "bg-primary/10", // Corrected property name
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
