import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { validateRequest } from "../../auth";

// Replace this with your actual user info fetch logic
async function getUserInfo(accessToken: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_KEYCLOAK_USERINFO_ENDPOINT ||
      "http://localhost:8081/realms/kong/protocol/openid-connect/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return await response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { user } = await validateRequest(req);
  return res.status(200).json({ user });
}
