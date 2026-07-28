import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setStatus(data.session ? "ok" : "denied");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setStatus(session ? "ok" : "denied");
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (status === "checking") return null;
  if (status === "denied") return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
