import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { validateRequestFromCookie } from "../../../auth";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async ({ req }) => {
      const { user, token } = await validateRequestFromCookie(req.headers.cookie);
      if (!user) throw new UploadThingError("Unauthorized");
      return { user, token };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata?.user?.avatarUrl;

      // Clean up old avatar file from UploadThing if it exists
      if (oldAvatarUrl?.includes(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)) {
        const key = oldAvatarUrl.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1];
        if (key) {
          await new UTApi().deleteFiles(key);
        }
      }

      // Build new avatar URL using UploadThing slug format
      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      // Sync avatar update to Spring Boot backend
      await fetch(`http://localhost:8080/api/users/${metadata.user.id}/avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${metadata.token}`,
        },
        body: JSON.stringify({ avatarUrl: newAvatarUrl }),
      });

      return { avatarUrl: newAvatarUrl };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      const { user, token } = await validateRequestFromCookie(req.headers.cookie);
      if (!user) throw new UploadThingError("Unauthorized");
      return { token };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const mediaType = file.type.startsWith("image") ? "IMAGE" : "VIDEO";
      const url = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      const response = await fetch("http://localhost:8080/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${metadata.token}`,
        },
        body: JSON.stringify({ url, type: mediaType }),
      });

      if (!response.ok) {
        throw new UploadThingError("Failed to create media record in backend.");
      }

      const media = await response.json();
      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
