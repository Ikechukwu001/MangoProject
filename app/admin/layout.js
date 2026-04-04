import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminUser) {
    redirect("/papers");
  }

  return <>{children}</>;
}