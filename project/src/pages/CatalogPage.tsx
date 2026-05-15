import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ShoppingCart, Star, Snowflake, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PRODUCTS, formatCLP, getCategoryLabel } from "@/lib/data";
import type { Category } from "@/lib/data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

const ALL_CATEGORIES: { id: Category | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "Todos", emoji: "🌊" },
  { id: "salmon", label: "Salmón", emoji: "🐟" },
  { id: "camarones", label: "Camarones", emoji: "🦐" },
  { id: "mariscos", label: "Mariscos", emoji: "🦪" },
  { id: "reineta", label: "Reineta", emoji: "🐡" },
  { id: "congelados", label: "Congelados", emoji: "❄️" },
];

type SortOption = "featured" | "price-asc" | "price-desc" | "name" | "stock";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    (searchParams.get("cat") as Category) || "all"
  );
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          getCategoryLabel(p.category).toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "stock":
        list.sort((a, b) => b.stock - a.stock);
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [selectedCategory, search, sort]);

  const handleCategoryChange = (cat: Category | "all") => {
    setSelectedCategory(cat);
    if (cat === "all") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", cat);
    }
    setSearchParams(searchParams);
  };

  const handleAdd = (product: (typeof PRODUCTS)[0]) => {
    addItem(product);
    toast.success(`${product.name} agregado`, {
      description: formatCLP(product.price),
    });
  };

  return (
    <div className="min-h-screen py-8">
      {/* Page Header */}
      <div className="bg-ocean-gradient py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl font-extrabold mb-2">Catálogo de Productos</h1>
          <p className="text-white/75 text-lg">
            Productos frescos y congelados del mar chileno
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar salmón, camarones, mariscos..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-44 gap-2">
                <SlidersHorizontal className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="price-asc">Precio: Menor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="stock">Disponibilidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-ocean"
                  : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent/50"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filtered.length === 0
              ? "Sin resultados"
              : `${filtered.length} producto${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
          </p>
          {(search || selectedCategory !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                handleCategoryChange("all");
              }}
              className="gap-2 text-muted-foreground"
            >
              <X className="size-3" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌊</div>
            <h3 className="text-xl font-semibold mb-2">Sin resultados</h3>
            <p className="text-muted-foreground mb-6">
              No encontramos productos con esos filtros
            </p>
            <Button
              onClick={() => {
                setSearch("");
                handleCategoryChange("all");
              }}
            >
              Ver todos los productos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filtered.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden shadow-card-hover border-0 shadow-ocean bg-card"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold">
                      {product.badge}
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="outline" className="text-white border-white bg-black/50 text-sm px-4 py-1">
                        Sin Stock
                      </Badge>
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= product.minStock && (
                    <Badge
                      variant="destructive"
                      className="absolute top-3 right-3 text-xs"
                    >
                      ¡Últimas unidades!
                    </Badge>
                  )}
                </div>

                <CardContent className="p-5">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {getCategoryLabel(product.category)}
                      </Badge>
                      {product.coldChain && (
                        <Snowflake className="size-3.5 text-primary" />
                      )}
                    </div>
                    <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">(5.0)</span>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-primary">
                          {formatCLP(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCLP(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        por {product.unit} · {product.weight}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-aqua-gradient text-white hover:opacity-90 transition-opacity flex-shrink-0 px-3"
                      onClick={() => handleAdd(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="size-3.5" />
                      <span className="hidden sm:inline">Agregar</span>
                    </Button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${
                      product.stock === 0
                        ? "text-destructive"
                        : product.stock <= product.minStock
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                    }`}>
                      <div className={`size-2 rounded-full ${
                        product.stock === 0 ? "bg-destructive" :
                        product.stock <= product.minStock ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                      {product.stock === 0
                        ? "Sin stock"
                        : product.stock <= product.minStock
                        ? `${product.stock} disponibles`
                        : "En stock"}
                    </div>
                    <span className="text-xs text-muted-foreground">{product.origin}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
