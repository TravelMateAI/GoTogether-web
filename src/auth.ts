import { Lucia } from "lucia";
import { Google } from "arctic"; // Changed import source
// Assuming a placeholder adapter for now. In a real app, this would be configured.
// e.g., import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
// import { prisma } from "./lib/prisma"; // Assuming prisma client is setup

import * as cookie from "cookie"; // ✅ this works
// ✅ For server components using next/headers
import { cookies } from "next/headers";

// Placeholder for Lucia adapter - replace with actual adapter (e.g., Prisma)
const adapter = {
  getSessionAndUser: async (sessionId: string) => {
    // Implement according to your database and session management
    console.warn("Lucia adapter getSessionAndUser not fully implemented.");
    return [null, null] as [any, any]; // [session, user]
  },
  getUserSessions: async (userId: string) => {
    console.warn("Lucia adapter getUserSessions not fully implemented.");
    return [] as any[]; // array of sessions
  },
  setSession: async (session: any) => {
    console.warn("Lucia adapter setSession not fully implemented.");
  },
  updateSessionExpiration: async (sessionId: string, expiresAt: Date) => {
    console.warn("Lucia adapter updateSessionExpiration not fully implemented.");
  },
  deleteSession: async (sessionId: string) => {
    console.warn("Lucia adapter deleteSession not fully implemented.");
  },
  deleteUserSessions: async (userId: string) => {
    console.warn("Lucia adapter deleteUserSessions not fully implemented.");
  },
  deleteExpiredSessions: async () => {
    console.warn("Lucia adapter deleteExpiredSessions not fully implemented.");
  }
  // You might also need setUser, updateUser, etc. depending on your adapter
};


export const lucia = new Lucia(adapter as any, { // Cast as any due to placeholder
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      // e.g., username: attributes.username
    };
  },
});

// Register your Lucia instance globally (if not already done elsewhere)
// globalThis.lucia = lucia; // Or use a more robust singleton pattern

// Define Google OAuth provider
// Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI are in your .env
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID", // Fallback for build to pass
  process.env.GOOGLE_CLIENT_SECRET || "YOUR_GOOGLE_CLIENT_SECRET", // Fallback
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/login/google/callback" // Fallback
);

export async function getUserInfo(accessToken: string) {
  const response = await fetch(
    "http://localhost:8081/realms/kong/protocol/openid-connect/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch user info");
  return await response.json();
}

// Shared base64 decoder
function decodeUser(encoded: string) {
  try {
    console.log("📦 Raw encoded user cookie:", JSON.stringify(encoded));

    // 🔧 Fix: strip surrounding quotes if present
    if (encoded.startsWith('"') && encoded.endsWith('"')) {
      encoded = encoded.slice(1, -1);
      console.log("🧹 Stripped quotes:", encoded);
    }

    console.log("🔎 Raw length:", encoded.length);

    // Step 1: Replace URL-safe Base64 characters
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    // Step 2: Strip existing padding
    const stripped = base64.replace(/=+$/, "");
    console.log("🚫 After stripping padding:", stripped);

    // Step 3: Add correct padding if needed
    const paddingNeeded = 4 - (stripped.length % 4);
    if (paddingNeeded < 4) {
      base64 = stripped + "=".repeat(paddingNeeded);
      console.log(
        `➕ Added padding: ${"=".repeat(paddingNeeded)} (Final length: ${base64.length})`,
      );
    } else {
      base64 = stripped;
      console.log("✅ No padding needed");
    }

    console.log("🧪 Normalized base64 string:", base64);

    // Step 4: Decode
    const decoded = atob(base64);
    console.log("✅ Decoded JSON string:", decoded);

    const parsed = JSON.parse(decoded);
    console.log("✅ Parsed user object:", parsed);

    return parsed;
  } catch (error) {
    console.error("❌ Failed to decode user cookie:", error);
    return null;
  }
}
// 🔐 For server components (RSCs)
export async function validateRequestServer() {
  const cookieStore = cookies();
  const rawUser = cookieStore.get("user")?.value;
  const token = cookieStore.get("access_token")?.value;

  if (!rawUser || !token) return { user: null, token: null };

  const user = decodeUser(rawUser);
  return { user, token };
}

// 🔐 For API routes
export async function validateRequest(req?: { headers?: { cookie?: string } }) {
  const cookieHeader = req?.headers?.cookie ?? "";
  const parsedCookies = cookie.parse(cookieHeader);
  const rawUser = parsedCookies["user"];
  const token = parsedCookies["access_token"];

  if (!rawUser || !token) return { user: null, token: null };

  const user = decodeUser(rawUser);
  return { user, token };
}
