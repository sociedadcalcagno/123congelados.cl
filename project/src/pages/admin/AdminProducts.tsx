import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Snowflake, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCLP, getCategoryLabel } from "@/lib/data";
import type { Product } from "@/lib/data";
import { getProducts, deleteProduct, createProduct, updateProduct } from "@/lib/supabase-service";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { toast } from "sonner";

export function AdminProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryLabel(p.category).toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Producto eliminado");
  };

  const handleSave = async (data: Omit<Product, "id">) => {
    if (editing) {
      const updated = await updateProduct(editing.id, data);
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      toast.success("Producto actualizado");
    } else {
      const created = await createProduct(data);
      setProducts((prev) => [...prev, created]);
      toast.success("Producto creado");
    }
  };

  const getStockBadge = (product: Product) => {
    if (product.stock === 0)
      return <Badge variant="destructive">Sin Stock</Badge>;
    if (product.stock <= product.minStock)
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400">Stock Bajo</Badge>;
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">En Stock</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Productos</h1>
          <p className="text-muted-foreground mt-1">{products.length} productos registrados</p>
        </div>
        <Button className="gap-2 bg-aqua-gradient text-white" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="size-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Productos", value: products.length, icon: Package, color: "text-primary", bg: "bg-primary/10" },
          { label: "En Stock", value: products.filter(p => p.stock > p.minStock).length, icon: Snowflake, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
          { label: "Stock Bajo", value: products.filter(p => p.stock <= p.minStock && p.stock > 0).length, icon: Snowflake, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
          { label: "Sin Stock", value: products.filter(p => p.stock === 0).length, icon: Snowflake, color: "text-destructive", bg: "bg-destructive/10" },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-ocean border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`size-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-ocean border-0">
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle>Lista de Productos</CardTitle>
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img src={product.image} alt={product.name} className="size-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.weight} · {product.origin}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold">{formatCLP(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatCLP(product.originalPrice)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {product.stock} {product.unit}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mín: {product.minStock}
                      </p>
                    </TableCell>
                    <TableCell>{getStockBadge(product)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => { setEditing(product); setDialogOpen(true); }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        onSave={handleSave}
      />
    </div>
  );
}
