import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = cookies().get("access_token")?.value;

  if (accessToken) {
    // user is logged in, redirect to home
    redirect("/");
  }

  return <>{children}</>;
}
