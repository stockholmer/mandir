"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AdminRole = "super_admin" | "admin" | "viewer";

interface AuthState {
  user: User | null;
  role: AdminRole | null;
  loading: boolean;
  isAdmin: boolean;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const LAST_ACTIVITY_KEY = "mandir_last_activity";

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchRole = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("admins")
        .select("role")
        .eq("id", userId)
        .single();

      if (data) {
        setRole(data.role as AdminRole);
      } else {
        setRole(null);
      }
    },
    [supabase]
  );

  // Track activity for session timeout
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    };

    const checkTimeout = () => {
      const last = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (last && Date.now() - parseInt(last) > SESSION_TIMEOUT_MS) {
        supabase.auth.signOut();
      }
    };

    // Check on focus
    window.addEventListener("focus", checkTimeout);
    // Track activity
    window.addEventListener("mousemove", updateActivity, { passive: true });
    window.addEventListener("keydown", updateActivity, { passive: true });

    updateActivity();

    return () => {
      window.removeEventListener("focus", checkTimeout);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, [user, supabase]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      if (u) {
        fetchRole(u.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchRole(u.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchRole]);

  return {
    user,
    role,
    loading,
    isAdmin: role === "super_admin" || role === "admin",
  };
}
