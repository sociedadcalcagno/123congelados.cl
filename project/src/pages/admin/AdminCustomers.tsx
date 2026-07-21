import { useEffect, useState } from "react";
import { Search, Users, TrendingUp, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCLP } from "@/lib/data";
import type { Customer } from "@/lib/data";
import { getCustomers } from "@/lib/supabase-service";

export function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Clientes</h1>
        <p className="text-muted-foreground mt-1">{customers.length} clientes registrados</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clientes</p>
              <p className="text-2xl font-extrabold">{customers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="size-11 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
              <TrendingUp className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue Total</p>
              <p className="text-2xl font-extrabold">{formatCLP(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-ocean border-0">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <TrendingUp className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket Promedio</p>
              <p className="text-2xl font-extrabold">{formatCLP(Math.round(avgOrderValue))}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-ocean border-0">
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="size-3" />
                        <span className="truncate max-w-32">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="size-3" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold">{customer.totalOrders}</span>
                    <span className="text-xs text-muted-foreground ml-1">pedidos</span>
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatCLP(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.lastOrder}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        customer.status === "activo"
                          ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {customer.status === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
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
