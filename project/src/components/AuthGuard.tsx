import { Navigate } from "react-router-dom";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem("123congelados-admin") === "true";
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
