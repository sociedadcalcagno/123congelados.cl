import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import type { Product, Category } from "@/lib/data";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (data: Omit<Product, "id">) => Promise<void>;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "salmon", label: "Salmón" },
  { value: "camarones", label: "Camarones" },
  { value: "mariscos", label: "Mariscos" },
  { value: "reineta", label: "Reineta" },
  { value: "congelados", label: "Congelados Premium" },
];

export function ProductFormDialog({ open, onOpenChange, product, onSave }: ProductFormDialogProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "salmon" as Category,
    price: "",
    originalPrice: "",
    stock: "",
    minStock: "",
    unit: "kg",
    weight: "",
    image: "/product-salmon.webp",
    description: "",
    featured: false,
    badge: "",
    origin: "",
    coldChain: true,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : "",
        stock: String(product.stock),
        minStock: String(product.minStock),
        unit: product.unit,
        weight: product.weight,
        image: product.image,
        description: product.description,
        featured: product.featured,
        badge: product.badge ?? "",
        origin: product.origin,
        coldChain: product.coldChain,
      });
    } else {
      setForm({
        name: "", category: "salmon", price: "", originalPrice: "",
        stock: "0", minStock: "5", unit: "kg", weight: "1 kg",
        image: "/product-salmon.webp", description: "", featured: false,
        badge: "", origin: "Chile", coldChain: true,
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        minStock: Number(form.minStock),
        unit: form.unit,
        weight: form.weight,
        image: form.image,
        description: form.description,
        featured: form.featured,
        badge: form.badge || undefined,
        origin: form.origin,
        coldChain: form.coldChain,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifica los datos del producto." : "Completa los campos para crear un nuevo producto."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label>Nombre *</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Origen</Label>
              <Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Precio (CLP) *</Label>
              <Input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Precio original (CLP)</Label>
              <Input type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Stock *</Label>
              <Input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Stock mínimo</Label>
              <Input type="number" min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Unidad</Label>
              <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="paq">paq</SelectItem>
                  <SelectItem value="pack">pack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Peso</Label>
              <Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Opcional" />
            </div>
            <div className="space-y-2">
              <Label>Imagen (ruta)</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              <Label>Destacado</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.coldChain} onCheckedChange={(v) => setForm({ ...form, coldChain: v })} />
              <Label>Cadena de frío</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving} className="bg-aqua-gradient text-white">
              {saving ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
