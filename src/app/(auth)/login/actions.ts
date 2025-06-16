"use server";

import { loginSchema, LoginValues } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credentials: LoginValues,
): Promise<{ error?: string } | void> {
  const { username, password } = loginSchema.parse(credentials);

  console.debug("[login] Sending credentials to backend:", { username });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies set by the backend
      body: JSON.stringify({ username, password }),
    },
  );

  if (!res.ok) {
    const error = await res.json();
    console.warn("[login] Login failed:", error);
    return { error: error.message || "Login failed" };
  }

  const { accessToken, user: userDetails } = await res.json();

  console.debug("[login] Received access token and user details:", {
    accessToken,
    userDetails,
  });

  if (!accessToken || !userDetails) {
    console.error("[login] Invalid response from backend");
    return { error: "Invalid login response" };
  }

  // Step 3: Store access token and user info in cookies
  const cookieStore = cookies();

  cookieStore.set("access_token", accessToken, {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600, // Or use expiresIn from backend response if available and preferred
  });

  cookieStore.set("user", JSON.stringify(userDetails), {
    path: "/",
    httpOnly: false, // Client can read
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600, // Or use expiresIn from backend response
  });

  // ✅ Will throw NEXT_REDIRECT internally to trigger redirect
  redirect("/");
}
