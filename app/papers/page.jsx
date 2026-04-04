import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import PapersClient from "@/components/papers/PapersClient";

export default async function PapersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ❌ Not logged in → redirect home
  if (!user) {
    redirect("/");
  }

  return <PapersClient user={user} />;
}