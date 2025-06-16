export function logout() {
  // Clear client-side cookies
  document.cookie = "access_token=; path=/; max-age=0; Secure; SameSite=Lax";
  document.cookie = "user=; path=/; max-age=0; Secure; SameSite=Lax";
  document.cookie =
    "refresh_token=; path=/api/auth/refresh; max-age=0; Secure; SameSite=Lax";

  // Redirect to Keycloak logout endpoint
  const logoutUrl = process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL!;
  const redirectUri = process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI!;
  const fullLogoutUrl = `${logoutUrl}?client_id=kong-oidc&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = fullLogoutUrl;
}
