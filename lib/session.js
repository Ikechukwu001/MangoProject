import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Use this in server code (route handlers, server components) to get the logged-in user.
// Returns null when nobody is logged in.
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}