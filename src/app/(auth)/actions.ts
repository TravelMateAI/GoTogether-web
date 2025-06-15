"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // If no token, redirect to login
  if (!accessToken) {
    return redirect("/login");
  }

  // Clear cookies
  cookieStore.set("access_token", "", {
    path: "/",
    maxAge: 0,
  });
  cookieStore.set("user", "", {
    path: "/",
    maxAge: 0,
  });
  cookieStore.set("refresh_token", "", {
    path: "/api/auth/refresh",
    maxAge: 0,
  });

  // Prepare Keycloak logout URL
  const logoutUrl =
    process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL ||
    "http://localhost:8084/realms/kong/protocol/openid-connect/logout";
  const redirectUri =
    process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI ||
    "http://localhost:3000/login";

  const fullLogoutUrl = `${logoutUrl}?client_id=kong-oidc&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;

  // Perform redirect
  return redirect(fullLogoutUrl);
}
