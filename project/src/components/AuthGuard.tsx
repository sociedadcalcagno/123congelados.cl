import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "ok" | "denied">(
    localStorage.getItem("123congelados-admin") === "true" ? "ok" : "checking"
  );

  useEffect(() => {
    if (localStorage.getItem("123congelados-admin") === "true") {
      setStatus("ok");
      return;
    }

    let mounted = true;
    const timeout = window.setTimeout(() => {
      if (mounted) setStatus("denied");
    }, 3000);

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      window.clearTimeout(timeout);
      if (data.session) localStorage.setItem("123congelados-admin", "true");
      setStatus(data.session ? "ok" : "denied");
    }).catch(() => {
      if (!mounted) return;
      window.clearTimeout(timeout);
      setStatus("denied");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setStatus(session ? "ok" : "denied");
    });

    return () => {
      mounted = false;
      window.clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-sm text-muted-foreground">
        Cargando administración...
      </div>
    );
  }
  if (status === "denied") return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
