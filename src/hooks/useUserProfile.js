"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function useUserProfile() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;
  const userId = user?.id ?? null;

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (isPending) return;

    if (!userId) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    let mounted = true;
    setLoadingProfile(true);

    fetch("/api/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted) return;
        setProfile(data?.profile ?? null);
        setLoadingProfile(false);
      })
      .catch(() => {
        if (!mounted) return;
        setProfile(null);
        setLoadingProfile(false);
      });

    return () => {
      mounted = false;
    };
  }, [isPending, userId, tick]);

  const loading = isPending || loadingProfile;
  const isPremium =
    profile?.plan === "premium" || profile?.premium_status === "active";
  const isPending_ = profile?.premium_status === "pending";

  return {
    user,
    profile,
    loading,
    isPremium,
    isPending: isPending_,
    refresh,
  };
}