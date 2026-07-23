import { useEffect, useState } from "react";
import { Plus, Tag, Percent, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  getPromotions, createPromotion, updatePromotion, deletePromotion,
} from "@/lib/supabase-service";
import type { Promotion } from "@/lib/supabase-service";
import { PromotionFormDialog } from "@/components/admin/PromotionFormDialog";

export function AdminPromotions() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  useEffect(() => {
    getPromotions().then(setPromos);
  }, []);

  const toggleActive = async (id: string) => {
    const promo = promos.find((p) => p.id === id);
    if (!promo) return;
    await updatePromotion(id, { active: !promo.active });
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    toast.success("Promoción actualizada");
  };

  const handleDelete = async (id: string) => {
    await deletePromotion(id);
    setPromos((prev) => prev.filter((p) => p.id !== id));
    toast.success("Promoción eliminada");
  };

  const handleSave = async (data: Omit<Promotion, "id" | "uses">) => {
    try {
      if (editing) {
        await updatePromotion(editing.id, data);
        setPromos((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p)));
        toast.success("Promoción actualizada");
      } else {
        const created = await createPromotion(data);
        setPromos((prev) => [...prev, created]);
        toast.success("Promoción creada");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la promoción");
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Promociones</h1>
          <p className="text-muted-foreground mt-1">{promos.filter(p => p.active).length} promociones activas</p>
        </div>
        <Button className="gap-2 bg-aqua-gradient text-white" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="size-4" />
          Nueva Promoción
        </Button>
      </div>

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
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => toggleActive(promo.id)}>
                  {promo.active ? "Desactivar" : "Activar"}
                </Button>
                <Button variant="ghost" size="icon" className="size-9" onClick={() => { setEditing(promo); setDialogOpen(true); }}>
                  <Edit className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-9 text-destructive hover:text-destructive" onClick={() => handleDelete(promo.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PromotionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        promotion={editing}
        onSave={handleSave}
      />
    </div>
  );
}
