import { useState } from "react";
import { AlertTriangle, TrendingDown, TrendingUp, RefreshCw, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PRODUCTS, INVENTORY_MOVEMENTS, formatCLP } from "@/lib/data";
import { toast } from "sonner";

export function AdminInventory() {
  const [products] = useState(PRODUCTS);

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.stock <= p.minStock && p.stock > 0);
  const outOfStock = products.filter(p => p.stock === 0);

  const getStockPercent = (product: typeof products[0]) => {
    const max = product.minStock * 5;
    return Math.min((product.stock / max) * 100, 100);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Inventario</h1>
          <p className="text-muted-foreground mt-1">Control de stock en tiempo real</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => toast.success("Inventario actualizado")}>
          <RefreshCw className="size-4" />
          Actualizar
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Snowflake className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-xl font-extrabold">{formatCLP(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                <TrendingUp className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos OK</p>
                <p className="text-xl font-extrabold">{products.filter(p => p.stock > p.minStock).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 flex items-center justify-center">
                <AlertTriangle className="size-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
                <p className="text-xl font-extrabold text-yellow-600">{lowStock.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="size-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sin Stock</p>
                <p className="text-xl font-extrabold text-destructive">{outOfStock.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <Card className="border-yellow-300 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-950/10 shadow-ocean border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
              <AlertTriangle className="size-5" />
              Alertas de Stock Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {outOfStock.map(p => (
                <Badge key={p.id} variant="destructive" className="gap-1.5">
                  {p.name} — Sin Stock
                </Badge>
              ))}
              {lowStock.map(p => (
                <Badge key={p.id} className="bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/50 gap-1.5">
                  {p.name} — {p.stock} {p.unit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Table */}
      <Card className="shadow-ocean border-0">
        <CardHeader>
          <CardTitle>Stock por Producto</CardTitle>
          <CardDescription>Estado actual del inventario de congelados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Disponible</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={p.image} alt={p.name} className="size-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.weight}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {p.stock} {p.unit}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.minStock} {p.unit}
                  </TableCell>
                  <TableCell className="min-w-28">
                    <div className="space-y-1">
                      <Progress
                        value={getStockPercent(p)}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">{Math.round(getStockPercent(p))}%</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatCLP(p.price * p.stock)}
                  </TableCell>
                  <TableCell>
                    {p.stock === 0 ? (
                      <Badge variant="destructive">Sin Stock</Badge>
                    ) : p.stock <= p.minStock ? (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400">Bajo</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">OK</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1"
                      onClick={() => toast.info(`Reabasteciendo ${p.name}`)}
                    >
                      <RefreshCw className="size-3" />
                      Reabastecer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Movements */}
      <Card className="shadow-ocean border-0">
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>Últimas entradas, salidas y ajustes de inventario</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVENTORY_MOVEMENTS.map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell className="font-medium text-sm">{mov.productName}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        mov.type === "entrada"
                          ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                          : mov.type === "salida"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400"
                      }
                    >
                      {mov.type.charAt(0).toUpperCase() + mov.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${mov.quantity < 0 ? "text-destructive" : mov.type === "entrada" ? "text-green-600" : "text-blue-600"}`}>
                      {mov.quantity > 0 ? "+" : ""}{mov.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{mov.reason}</TableCell>
                  <TableCell className="text-sm">{mov.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{mov.user}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
