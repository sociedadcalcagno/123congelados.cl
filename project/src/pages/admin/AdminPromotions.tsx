import { useState } from "react";
import { Plus, Tag, Percent, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const PROMOTIONS = [
  { id: "promo1", name: "Descuento Salmón Mayo", code: "SALMON20", discount: 20, type: "percent", category: "salmon", active: true, uses: 34, expiry: "2025-05-31" },
  { id: "promo2", name: "Pack Ahorro Verano", code: "VERANO15", discount: 15, type: "percent", category: "all", active: true, uses: 21, expiry: "2025-06-30" },
  { id: "promo3", name: "Primera Compra", code: "BIENVENIDO", discount: 10, type: "percent", category: "all", active: true, uses: 58, expiry: "2025-12-31" },
  { id: "promo4", name: "Camarones 2x1", code: "CAMARONES2X1", discount: 50, type: "percent", category: "camarones", active: false, uses: 12, expiry: "2025-04-30" },
];

export function AdminPromotions() {
  const [promos, setPromos] = useState(PROMOTIONS);

  const toggleActive = (id: string) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    toast.success("Promoción actualizada");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Promociones</h1>
          <p className="text-muted-foreground mt-1">{promos.filter(p => p.active).length} promociones activas</p>
        </div>
        <Button className="gap-2 bg-aqua-gradient text-white" onClick={() => toast.info("Nueva promoción")}>
          <Plus className="size-4" />
          Nueva Promoción
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Tag className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Activas</p>
              <p className="text-2xl font-extrabold">{promos.filter(p => p.active).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="size-11 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
              <Percent className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usos Totales</p>
              <p className="text-2xl font-extrabold">{promos.reduce((s, p) => s + p.uses, 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="size-11 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 flex items-center justify-center">
              <Tag className="size-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactivas</p>
              <p className="text-2xl font-extrabold">{promos.filter(p => !p.active).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map((promo) => (
          <Card key={promo.id} className={`shadow-ocean border ${promo.active ? "border-primary/20" : "border-border opacity-70"}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold">{promo.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono font-bold text-primary">
                      {promo.code}
                    </code>
                    <Badge variant={promo.active ? "default" : "secondary"} className="text-xs">
                      {promo.active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-primary">{promo.discount}%</p>
                  <p className="text-xs text-muted-foreground">descuento</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center py-3 border-t border-border">
                <div>
                  <p className="text-lg font-bold">{promo.uses}</p>
                  <p className="text-xs text-muted-foreground">usos</p>
                </div>
                <div>
                  <p className="text-sm font-bold capitalize">{promo.category === "all" ? "Todos" : promo.category}</p>
                  <p className="text-xs text-muted-foreground">categoría</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{promo.expiry}</p>
                  <p className="text-xs text-muted-foreground">vence</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => toggleActive(promo.id)}
                >
                  {promo.active ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => toast.info(`Editando ${promo.name}`)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 text-destructive hover:text-destructive"
                  onClick={() => {
                    setPromos(prev => prev.filter(p => p.id !== promo.id));
                    toast.success("Promoción eliminada");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
