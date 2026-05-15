import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Storefront
import { StorefrontHeader } from "@/components/layout/StorefrontHeader";
import { StorefrontFooter } from "@/components/layout/StorefrontFooter";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LandingPage } from "@/pages/LandingPage";
import { CatalogPage } from "@/pages/CatalogPage";
import { CheckoutPage } from "@/pages/CheckoutPage";

// Admin
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminInventory } from "@/pages/admin/AdminInventory";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminCustomers } from "@/pages/admin/AdminCustomers";
import { AdminSales } from "@/pages/admin/AdminSales";
import { AdminPromotions } from "@/pages/admin/AdminPromotions";

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StorefrontHeader />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}

export function App() {
  return (
    <>
      <Routes>
        {/* Storefront */}
        <Route
          path="/"
          element={
            <StorefrontLayout>
              <LandingPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/catalogo"
          element={
            <StorefrontLayout>
              <CatalogPage />
            </StorefrontLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <StorefrontLayout>
              <CheckoutPage />
            </StorefrontLayout>
          }
        />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="inventario" element={<AdminInventory />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="clientes" element={<AdminCustomers />} />
          <Route path="ventas" element={<AdminSales />} />
          <Route path="promociones" element={<AdminPromotions />} />
        </Route>
      </Routes>

      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;
