import * as cookie from "cookie"; // ✅ this works
// ✅ For server components using next/headers
import { cookies } from "next/headers";

export async function getUserInfo(accessToken: string) {
  const response = await fetch(
    "http://localhost:8081/realms/kong/protocol/openid-connect/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch user info");
  return await response.json();
}


export async function validateRequestServer() {
  const cookieStore = cookies();
  const rawUser = cookieStore.get("user")?.value;
  const token = cookieStore.get("access_token")?.value;

  if (!rawUser || !token) return { user: null, token: null };

  try {
    const user = JSON.parse(rawUser);
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}


// Use in API routes where you have req
// For API routes
export async function validateRequest(req?: { headers?: { cookie?: string } }) {
  const cookieHeader = req?.headers?.cookie ?? "";
  const cookies = cookie.parse(cookieHeader);
  const rawUser = cookies["user"];
  const token = cookies["access_token"];
  if (!rawUser || !token) return { user: null, token: null };

  try {
    const user = JSON.parse(rawUser);
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}



// Use in UploadThing where only raw cookie is available
export async function validateRequestFromCookie(rawCookie: string | undefined) {
  const cookies = cookie.parse(rawCookie || "");
  const token = cookies["keycloak_session"];
  if (!token) return { user: null, token: null };

  try {
    const user = await getUserInfo(token);
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

