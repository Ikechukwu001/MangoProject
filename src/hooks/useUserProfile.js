"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

export default function useUserProfile() {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(user ?? null);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("id, email, full_name, plan, premium_status")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;
        setProfile(data || null);
      }

      setLoading(false);
    }

    load();

    // 🔥 auto refresh when auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const isPremium =
    profile?.plan === "premium" || profile?.premium_status === "active";

  const isPending = profile?.premium_status === "pending";

  return {
    user,
    profile,
    loading,
    isPremium,
    isPending,
  };
}