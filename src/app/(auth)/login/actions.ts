"use server";

import { loginSchema, LoginValues } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credentials: LoginValues,
): Promise<{ error?: string } | void> {
  const { username, password } = loginSchema.parse(credentials);

  console.debug("[login] Sending credentials to backend:", { username });

  const res = await fetch("/api/auth/login", {
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

  // ✅ Will throw NEXT_REDIRECT internally to trigger redirect
  redirect("/");
}
