"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return redirect("/login");
  }

  // Properly clear cookies
  const cookieOptions = {
    path: "/",
    maxAge: 0,
    secure: true,
    domain: ".go-together-uom.vercel.app", // or remove this if same-site cookies
  };

  cookieStore.set("access_token", "", cookieOptions);
  cookieStore.set("refresh_token", "", {
    ...cookieOptions,
    path: "/api/auth/refresh",
  });
  cookieStore.set("user", "", cookieOptions);

  const logoutUrl = process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL!;
  const redirectUri = process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI!;

  const fullLogoutUrl = `${logoutUrl}?client_id=kong-oidc&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;

  return redirect(fullLogoutUrl);
}
