"use server";

import { loginSchema, LoginValues } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const KEYCLOAK_BASE_URL = "http://localhost:8081/realms/kong";
const KEYCLOAK_CLIENT_ID = "kong-oidc";
const KEYCLOAK_CLIENT_SECRET = "fBHJFdikM0ERtTXnvebguHRz6iPUfJfV";

export async function login(
  credentials: LoginValues
): Promise<{ error?: string } | void> {
  const { username, password } = loginSchema.parse(credentials);

  // Step 1: Get token from Keycloak
  const tokenRes = await fetch(`${KEYCLOAK_BASE_URL}/protocol/openid-connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: KEYCLOAK_CLIENT_ID,
      client_secret: KEYCLOAK_CLIENT_SECRET,
      grant_type: "password",
      username,
      password,
      scope: "openid profile email",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    return {
      error: tokenData.error_description || "Invalid username or password",
    };
  }

  const accessToken = tokenData.access_token;

  // Step 2: Fetch user info using the access token
  const userinfoRes = await fetch(`${KEYCLOAK_BASE_URL}/protocol/openid-connect/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userinfoRes.ok) {
    return {
      error: "Failed to fetch user info from Keycloak",
    };
  }

  const user = await userinfoRes.json();

  const userDetailsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/email/${user.email}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!userDetailsRes.ok) {
    return {
      error: "Failed to fetch user details from user service",
    };
  }
  
  const userDetails = await userDetailsRes.json();  

  // Step 3: Store access token and user info in cookies
  const cookieStore = cookies();

  cookieStore.set("access_token", accessToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
  });

  cookieStore.set("user", JSON.stringify(userDetails), {
    path: "/",
    httpOnly: false, // Client can read
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
  });

  // Step 4: Redirect to home page
  redirect("/");
}
