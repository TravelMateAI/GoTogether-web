"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return redirect("/login");
  }

  cookieStore.set("access_token", "", {
    path: "/",
    maxAge: 0,
  });
  cookieStore.set("user", "", { path: "/", maxAge: 0 });
  cookieStore.set("refresh_token", "", {
    path: "/api/auth/refresh",
    maxAge: 0,
  });
  const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL || "http://localhost:8084/realms/kong/protocol/openid-connect/logout"}?client_id=kong-oidc&post_logout_redirect_uri=${process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI || "http://localhost:3000/login"}`;
  return redirect(keycloakLogoutUrl);
}
