import { useEffect, useState } from "react";
import {
  TrendingUp, ShoppingBag, Users, Package,
  AlertTriangle, ArrowUpRight, ArrowDownRight, Snowflake
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { formatCLP, STATUS_CONFIG } from "@/lib/data";
import type { Product, Order } from "@/lib/data";
import { getProducts, getOrders, getSalesData, getCategorySales } from "@/lib/supabase-service";

const KPI_CARDS = [
  {
    title: "Ventas del Mes",
    value: formatCLP(3450000),
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
    desc: "vs. mes anterior",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Pedidos Totales",
    value: "72",
    change: "+8 este mes",
    trend: "up",
    icon: ShoppingBag,
    desc: "pedidos realizados",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Clientes Activos",
    value: "47",
    change: "+5 nuevos",
    trend: "up",
    icon: Users,
    desc: "este mes",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Productos en Stock",
    value: "12",
    change: "3 bajo mínimo",
    trend: "warning",
    icon: Package,
    desc: "variedades activas",
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
  },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name: string; color: string}>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass dark:glass-dark rounded-xl p-3 text-sm shadow-ocean border">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === "ventas" ? formatCLP(p.value) : `${p.value} pedidos`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<{month: string; ventas: number; pedidos: number}[]>([]);
  const [categorySales, setCategorySales] = useState<{name: string; value: number; color: string}[]>([]);

  useEffect(() => {
    Promise.all([getProducts(), getOrders(), getSalesData(), getCategorySales()]).then(([p, o, s, c]) => {
      setProducts(p);
      setOrders(o);
      setSalesData(s);
      setCategorySales(c);
    });
  }, []);

  const lowStock = products.filter((p) => p.stock <= p.minStock && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen del negocio · Mayo 2025
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.title} className="shadow-ocean border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-extrabold mt-1">{kpi.value}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {kpi.trend === "up" && <ArrowUpRight className="size-4 text-green-600" />}
                    {kpi.trend === "down" && <ArrowDownRight className="size-4 text-destructive" />}
                    {kpi.trend === "warning" && <AlertTriangle className="size-4 text-yellow-600" />}
                    <span className={`text-sm font-medium ${
                      kpi.trend === "up" ? "text-green-600" :
                      kpi.trend === "warning" ? "text-yellow-600" : "text-destructive"
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{kpi.desc}</span>
                  </div>
                </div>
                <div className={`size-12 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                  <kpi.icon className={`size-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 shadow-ocean border-0">
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
            <CardDescription>Evolución de ventas últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="ventas"
                    name="ventas"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                    dot={{ fill: "var(--chart-1)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Pie */}
        <Card className="shadow-ocean border-0">
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
            <CardDescription>Distribución del período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {categorySales.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ background: cat.color }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <Card className="shadow-ocean border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-600" />
              Alertas de Inventario
            </CardTitle>
            <CardDescription>
              {outOfStock.length} sin stock · {lowStock.length} bajo mínimo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {outOfStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <div className="size-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={p.image} alt={p.name} className="size-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <Badge variant="destructive" className="text-xs mt-0.5">Sin Stock</Badge>
                </div>
                <span className="text-sm font-bold text-destructive">0 {p.unit}</span>
              </div>
            ))}
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30">
                <div className="size-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={p.image} alt={p.name} className="size-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    Mínimo: {p.minStock} {p.unit}
                  </p>
                </div>
                <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">{p.stock} {p.unit}</span>
              </div>
            ))}
            {lowStock.length === 0 && outOfStock.length === 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400">
                <Snowflake className="size-5" />
                <p className="text-sm font-medium">Todo el inventario está en orden</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="shadow-ocean border-0">
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
            <CardDescription>Últimas {recentOrders.length} órdenes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">{formatCLP(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top Products Chart */}
      <Card className="shadow-ocean border-0">
        <CardHeader>
          <CardTitle>Pedidos por Mes</CardTitle>
          <CardDescription>Volumen de pedidos histórico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="pedidos"
                  name="pedidos"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
