import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip
} from "recharts";
import { SALES_DATA, CATEGORY_SALES, formatCLP } from "@/lib/data";
import { TrendingUp, ShoppingBag } from "lucide-react";

function ChartTooltip({ active, payload, label }: {active?: boolean; payload?: Array<{value: number; name: string; color: string}>; label?: string}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-xl p-3 text-sm shadow-ocean">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === "ventas" ? formatCLP(p.value) : `${p.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function AdminSales() {
  const totalSales = SALES_DATA.reduce((sum, s) => sum + s.ventas, 0);
  const totalOrders = SALES_DATA.reduce((sum, s) => sum + s.pedidos, 0);
  const avgTicket = totalSales / totalOrders;

  const topProducts = [
    { name: "Salmón Atlántico Premium", units: 124, revenue: 2357760 },
    { name: "Camarones Ecuatorianos", units: 98, revenue: 1567020 },
    { name: "Pack Congelados Premium", units: 45, revenue: 2024550 },
    { name: "Mix de Mariscos", units: 67, revenue: 1540330 },
    { name: "Filetes Salmón Ahumado", units: 55, revenue: 1374450 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Ventas</h1>
        <p className="text-muted-foreground mt-1">Análisis de ventas y revenue</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Revenue Total (7 meses)", value: formatCLP(totalSales), icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Pedidos", value: `${totalOrders}`, icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
          { label: "Ticket Promedio", value: formatCLP(Math.round(avgTicket)), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
        ].map((kpi) => (
          <Card key={kpi.label} className="shadow-ocean border-0">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`size-12 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`size-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-extrabold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales over time */}
      <Card className="shadow-ocean border-0">
        <CardHeader>
          <CardTitle>Ventas Históricas</CardTitle>
          <CardDescription>Revenue y pedidos por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="ventas" name="ventas" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#areaGrad1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="shadow-ocean border-0">
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
          <CardDescription>Ranking por unidades vendidas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
              <span className={`text-lg font-extrabold w-6 text-center ${
                index === 0 ? "text-yellow-500" :
                index === 1 ? "text-slate-400" :
                index === 2 ? "text-amber-600" :
                "text-muted-foreground"
              }`}>
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.units} unidades vendidas</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{formatCLP(product.revenue)}</p>
              </div>
              {index === 0 && <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">Top</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category bar chart */}
      <Card className="shadow-ocean border-0">
        <CardHeader>
          <CardTitle>Ventas por Categoría (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_SALES} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="value" name="%" fill="var(--chart-1)" radius={[0, 4, 4, 0]}>
                  {CATEGORY_SALES.map((entry, index) => (
                    <rect key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
