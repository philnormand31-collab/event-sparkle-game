import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdminStatus = useCallback(async (currentUser: User | null) => {
    if (!currentUser) return false;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Erreur vérification rôle admin:", error);
      return false;
    }

    return !!data;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const syncFromSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        const admin = await fetchAdminStatus(currentUser);
        if (!isMounted) return;
        setIsAdmin(admin);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      if (!isMounted) return;

      setUser(currentUser);
      fetchAdminStatus(currentUser)
        .then((admin) => {
          if (isMounted) setIsAdmin(admin);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    });

    void syncFromSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAdminStatus]);

  return { user, isAdmin, loading };
};
