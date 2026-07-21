import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

export interface Promotion {
  id: string;
  name: string;
  code: string;
  discount: number;
  type: "percent";
  category: string;
  active: boolean;
  uses: number;
  expiry: string;
}

interface PromotionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion?: Promotion | null;
  onSave: (data: Omit<Promotion, "id" | "uses">) => Promise<void>;
}

export function PromotionFormDialog({ open, onOpenChange, promotion, onSave }: PromotionFormDialogProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    discount: "",
    category: "all",
    active: true,
    expiry: "",
  });

  useEffect(() => {
    if (promotion) {
      setForm({
        name: promotion.name,
        code: promotion.code,
        discount: String(promotion.discount),
        category: promotion.category,
        active: promotion.active,
        expiry: promotion.expiry,
      });
    } else {
      setForm({ name: "", code: "", discount: "", category: "all", active: true, expiry: "" });
    }
  }, [promotion, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: form.name,
        code: form.code.toUpperCase(),
        discount: Number(form.discount),
        type: "percent",
        category: form.category,
        active: form.active,
        expiry: form.expiry,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{promotion ? "Editar Promoción" : "Nueva Promoción"}</DialogTitle>
          <DialogDescription>
            {promotion ? "Modifica los datos de la promoción." : "Completa los campos para crear una promoción."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Código *</Label>
              <Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="uppercase" />
            </div>
            <div className="space-y-2">
              <Label>Descuento (%) *</Label>
              <Input required type="number" min="1" max="100" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="salmon">Salmón</SelectItem>
                  <SelectItem value="camarones">Camarones</SelectItem>
                  <SelectItem value="mariscos">Mariscos</SelectItem>
                  <SelectItem value="reineta">Reineta</SelectItem>
                  <SelectItem value="congelados">Congelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vence *</Label>
              <Input required type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving} className="bg-aqua-gradient text-white">
              {saving ? "Guardando..." : promotion ? "Guardar cambios" : "Crear promoción"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
