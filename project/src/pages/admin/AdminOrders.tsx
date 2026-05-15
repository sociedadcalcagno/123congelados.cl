import { useState } from "react";
import { Search, Eye, CheckCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ORDERS, formatCLP, STATUS_CONFIG } from "@/lib/data";
import type { Order } from "@/lib/data";
import { toast } from "sonner";

export function AdminOrders() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [filter, setFilter] = useState<Order["status"] | "all">("all");

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Pedido ${id} actualizado a: ${STATUS_CONFIG[status].label}`);
  };

  const statusCounts = {
    pendiente: orders.filter(o => o.status === "pendiente").length,
    confirmado: orders.filter(o => o.status === "confirmado").length,
    en_despacho: orders.filter(o => o.status === "en_despacho").length,
    entregado: orders.filter(o => o.status === "entregado").length,
    cancelado: orders.filter(o => o.status === "cancelado").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Pedidos</h1>
          <p className="text-muted-foreground mt-1">{orders.length} pedidos en total</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {(Object.entries(statusCounts) as [Order["status"], number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(filter === status ? "all" : status)}
            className={`p-3 rounded-xl border text-center transition-all ${
              filter === status
                ? "border-primary bg-primary/10"
                : "bg-card border-border hover:border-primary/40"
            }`}
          >
            <p className="text-2xl font-extrabold">{count}</p>
            <p className={`text-xs font-medium mt-1 ${STATUS_CONFIG[status].color.split(" ")[1]} dark:${STATUS_CONFIG[status].color.split(" ")[3]}`}>
              {STATUS_CONFIG[status].label}
            </p>
          </button>
        ))}
      </div>

      <Card className="shadow-ocean border-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <CardTitle>Lista de Pedidos</CardTitle>
            <div className="relative flex-1 max-w-sm sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente o ID..."
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
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => {
                  const statusCfg = STATUS_CONFIG[order.status];
                  return (
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-primary">{order.id}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-40">
                          {order.items.slice(0, 2).map((item) => (
                            <p key={item.productId} className="text-xs text-muted-foreground truncate">
                              {item.quantity}x {item.name}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{order.items.length - 2} más</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{formatCLP(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{order.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => toast.info(`Ver detalles: ${order.id}`)}
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          {order.status === "pendiente" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-blue-600"
                              onClick={() => updateStatus(order.id, "confirmado")}
                            >
                              <CheckCircle className="size-3.5" />
                            </Button>
                          )}
                          {order.status === "confirmado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-primary"
                              onClick={() => updateStatus(order.id, "en_despacho")}
                            >
                              <Truck className="size-3.5" />
                            </Button>
                          )}
                          {order.status === "en_despacho" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-green-600"
                              onClick={() => updateStatus(order.id, "entregado")}
                            >
                              <CheckCircle className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
