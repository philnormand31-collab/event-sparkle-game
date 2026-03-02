import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdminStatus = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await fetchAdminStatus(currentUser);
      if (isMounted) setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await fetchAdminStatus(currentUser);
      if (isMounted) setLoading(false);
    });

    init();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAdminStatus]);

  return { user, isAdmin, loading };
};
