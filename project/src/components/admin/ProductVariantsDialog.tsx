import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import type { ProductVariant, ProductWithVariants } from "@/lib/supabase-service";
import { createProductVariant, deleteProductVariant, updateProductVariant } from "@/lib/supabase-service";
import { toast } from "sonner";

interface ProductVariantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductWithVariants | null;
  onChange: (variants: ProductVariant[]) => void;
}

export function ProductVariantsDialog({ open, onOpenChange, product, onChange }: ProductVariantsDialogProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setVariants(product?.variants ?? []);
  }, [product, open]);

  if (!product) return null;

  const handleAdd = async () => {
    setSaving(true);
    try {
      const created = await createProductVariant({
        product_id: product.id,
        name: "Nuevo calibre",
        price: product.price,
        stock: 0,
        unit: product.unit,
        weight: product.weight,
        active: true,
      });
      const next = [...variants, created];
      setVariants(next);
      onChange(next);
      toast.success("Calibre creado");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear el calibre";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<ProductVariant>) => {
    try {
      const updated = await updateProductVariant(id, updates);
      const next = variants.map((variant) => (variant.id === id ? updated : variant));
      setVariants(next);
      onChange(next);
      toast.success("Calibre actualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el calibre");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductVariant(id);
      const next = variants.filter((variant) => variant.id !== id);
      setVariants(next);
      onChange(next);
      toast.success("Calibre eliminado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el calibre");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Calibres / opciones de venta</DialogTitle>
          <DialogDescription>{product.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {variants.map((variant) => (
            <div key={variant.id} className="grid grid-cols-1 md:grid-cols-7 gap-3 rounded-lg border p-3">
              <div className="md:col-span-2 space-y-1">
                <Label>Nombre</Label>
                <Input defaultValue={variant.name} onBlur={(e) => handleUpdate(variant.id, { name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Precio</Label>
                <Input type="number" defaultValue={variant.price} onBlur={(e) => handleUpdate(variant.id, { price: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label>Stock</Label>
                <Input type="number" defaultValue={variant.stock} onBlur={(e) => handleUpdate(variant.id, { stock: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label>Unidad</Label>
                <Input defaultValue={variant.unit} onBlur={(e) => handleUpdate(variant.id, { unit: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Peso</Label>
                <Input defaultValue={variant.weight} onBlur={(e) => handleUpdate(variant.id, { weight: e.target.value })} />
              </div>
              <div className="flex items-end justify-between gap-2">
                <div className="flex items-center gap-2 pb-2">
                  <Switch checked={variant.active} onCheckedChange={(active) => handleUpdate(variant.id, { active })} />
                  <Label>Activo</Label>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(variant.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
          {variants.length === 0 && (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Este producto todavía no tiene calibres. Si no agregas calibres, se venderá como producto único.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button type="button" onClick={handleAdd} disabled={saving} className="gap-2 bg-aqua-gradient text-white">
            <Plus className="size-4" />
            {saving ? "Creando..." : "Agregar calibre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
