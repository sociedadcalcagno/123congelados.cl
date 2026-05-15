import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Fish, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { ModeToggle } from "@/components/mode-toggle";

export function StorefrontHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const count = itemCount();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/catalogo", label: "Catálogo" },
    { to: "/catalogo?cat=salmon", label: "Salmón" },
    { to: "/catalogo?cat=mariscos", label: "Mariscos" },
    { to: "/catalogo?cat=congelados", label: "Congelados" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/WhatsApp_Image_2026-05-15_at_7.15.28_AM.jpeg"
                alt="123 Congelados"
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/20 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+56995387455"
              className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="size-4" />
              <span>+56 9 9538 7455</span>
            </a>

            <ModeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-xs bg-primary">
                  {count}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>

            <Link to="/admin" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-2">
                <Fish className="size-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-accent/20 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10 px-4">
              <a href="tel:+56995387455" className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                +56 9 9538 7455
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
