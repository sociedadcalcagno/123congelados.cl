import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Warehouse, ShoppingBag, Users,
  BarChart3, Tag, LogOut, Fish, ChevronRight, Bell
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider,
  SidebarInset, SidebarTrigger, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { getOrders, getProducts } from "@/lib/supabase-service";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/inventario", label: "Inventario", icon: Warehouse },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/ventas", label: "Ventas", icon: BarChart3 },
  { to: "/admin/promociones", label: "Promociones", icon: Tag },
];

export function AdminLayout() {
  const location = useLocation();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  useEffect(() => {
    getOrders().then((orders) => {
      setPendingOrders(orders.filter((o) => o.status === "pendiente").length);
    });
    getProducts().then((products) => {
      setLowStockCount(products.filter((p) => p.stock <= p.minStock && p.stock > 0).length);
      setOutOfStockCount(products.filter((p) => p.stock === 0).length);
    });
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center">
              <Fish className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-sidebar-foreground text-sm leading-none">123 Congelados</p>
              <p className="text-xs text-sidebar-foreground/60 mt-0.5">Panel Administrador</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.slice(0, 1).map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.end
                          ? location.pathname === item.to
                          : location.pathname.startsWith(item.to)
                      }
                      tooltip={item.label}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Gestión</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.slice(1).map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith(item.to)}
                      tooltip={item.label}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.to === "/admin/pedidos" && pendingOrders > 0 && (
                      <SidebarMenuBadge>{pendingOrders}</SidebarMenuBadge>
                    )}
                    {item.to === "/admin/inventario" && (lowStockCount + outOfStockCount) > 0 && (
                      <SidebarMenuBadge className="bg-destructive/20 text-destructive">
                        {lowStockCount + outOfStockCount}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <LogOut />
                  <span>Ver Tienda</span>
                  <ChevronRight className="ml-auto size-3" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="px-2 py-1 text-xs text-sidebar-foreground/40">
            v1.0.0 · 123 Congelados
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Admin Top Bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex-1">
            <nav className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Admin</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-medium">
                {NAV_ITEMS.find(
                  (n) =>
                    n.end
                      ? location.pathname === n.to
                      : location.pathname.startsWith(n.to)
                )?.label ?? "Dashboard"}
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {(pendingOrders > 0 || lowStockCount > 0) && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute -top-1 -right-1 size-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  {pendingOrders + lowStockCount}
                </span>
              </Button>
            )}
            <ModeToggle />
            <div className="size-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">AD</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
