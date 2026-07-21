import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@congelados.cl";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "123Congelados2026!";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoading(false);
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      toast.error("Credenciales incorrectas");
      return;
    }
    localStorage.setItem("123congelados-admin", "true");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-ocean border-0">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto size-14 rounded-2xl bg-primary flex items-center justify-center">
            <Fish className="size-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-extrabold">Panel Administrador</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                required
                placeholder="admin@congelados.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-aqua-gradient text-white">
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
