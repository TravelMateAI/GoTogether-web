"use server";

import { signUpSchema, SignUpValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string } | void> {
  try {
    const { username, email, password, firstName, lastName } = signUpSchema.parse(credentials);

    // 👇 New: Call your Spring Boot backend API
    const res = await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        firstName, // <-- Optional, you can ask these fields from user if needed
        lastName,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("User registration failed:", err);
      return { error: "Failed to create user" };
    }

    return redirect("/login");

  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something3 went wrong. Please try again.",
    };
  }
}
