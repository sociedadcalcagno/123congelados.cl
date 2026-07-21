import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, ArrowRight, Star, Truck, Snowflake, Shield, Fish,
  ChevronRight, Award, ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCLP, getCategoryLabel } from "@/lib/data";
import { useCart } from "@/lib/cart-store";
import type { Product, Category } from "@/lib/data";
import { getProducts } from "@/lib/supabase-service";
import { toast } from "sonner";

const CATEGORIES: { id: Category; label: string; emoji: string; desc: string }[] = [
  { id: "salmon", label: "Salmón", emoji: "🐟", desc: "Atlántico & Patagónico" },
  { id: "camarones", label: "Camarones", emoji: "🦐", desc: "Jumbo & Pelados" },
  { id: "mariscos", label: "Mariscos", emoji: "🦪", desc: "Mix & Cholgas" },
  { id: "reineta", label: "Reineta", emoji: "🐡", desc: "Fresca del Pacífico" },
  { id: "congelados", label: "Congelados", emoji: "❄️", desc: "Premium Packs" },
];

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} agregado al carrito`, {
      description: formatCLP(product.price),
    });
  };

  return (
    <Card className="group overflow-hidden shadow-card-hover border-0 shadow-ocean bg-card">
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
        {product.stock <= product.minStock && (
          <Badge variant="destructive" className="absolute top-3 right-3">
            Pocas unidades
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">
              {getCategoryLabel(product.category)} · {product.origin}
            </p>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{product.weight}</p>
          </div>
          {product.coldChain && (
            <Snowflake className="size-4 text-primary flex-shrink-0 mt-1" />
          )}
        </div>

        <div className="flex items-end justify-between mt-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatCLP(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatCLP(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">/ {product.unit}</span>
          </div>
          <Button
            size="sm"
            className="gap-1 bg-aqua-gradient text-white hover:opacity-90 transition-opacity flex-shrink-0"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="size-3" />
            Agregar
          </Button>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className={`text-xs font-medium ${
            product.stock === 0
              ? "text-destructive"
              : product.stock <= product.minStock
              ? "text-yellow-600"
              : "text-green-600"
          }`}>
            {product.stock === 0
              ? "Sin stock"
              : product.stock <= product.minStock
              ? `Solo ${product.stock} disponibles`
              : `Stock: ${product.stock} ${product.unit}`}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-ocean-gradient flex items-center overflow-hidden">
        {/* Animated wave background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0">
            {/* Wave 1 */}
            <div className="relative" style={{ height: "180px" }}>
              <div
                className="absolute bottom-0 animate-wave"
                style={{ width: "200%", height: "100%" }}
              >
                <svg
                  viewBox="0 0 1440 180"
                  preserveAspectRatio="none"
                  className="w-1/2 h-full inline-block"
                  style={{ opacity: 0.15 }}
                >
                  <path d="M0,90 C360,160 720,20 1080,90 C1260,125 1350,110 1440,90 L1440,180 L0,180 Z" fill="white" />
                </svg>
                <svg
                  viewBox="0 0 1440 180"
                  preserveAspectRatio="none"
                  className="w-1/2 h-full inline-block"
                  style={{ opacity: 0.15 }}
                >
                  <path d="M0,90 C360,160 720,20 1080,90 C1260,125 1350,110 1440,90 L1440,180 L0,180 Z" fill="white" />
                </svg>
              </div>
            </div>
            {/* Wave 2 */}
            <div className="relative -mt-24" style={{ height: "120px" }}>
              <div
                className="absolute bottom-0"
                style={{
                  width: "200%",
                  height: "100%",
                  animation: "wave-move 10s linear infinite reverse",
                  opacity: 0.1,
                }}
              >
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-1/2 h-full inline-block">
                  <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill="white" />
                </svg>
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-1/2 h-full inline-block">
                  <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill="white" />
                </svg>
              </div>
            </div>
          </div>

          {/* Floating bubbles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 border border-white/10"
              style={{
                width: `${30 + i * 20}px`,
                height: `${30 + i * 20}px`,
                left: `${10 + i * 15}%`,
                bottom: `${20 + i * 10}%`,
                animation: `float-up ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            {/* Text content */}
            <div className="text-white">
              <Badge className="mb-6 bg-white/15 text-white border-white/25 backdrop-blur-sm px-4 py-1.5 text-sm">
                <Snowflake className="size-3 mr-2" />
                Cadena de Frío Garantizada
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-balance">
                Todo lo que necesitas{" "}
                <span className="text-gradient-cyan">del mar,</span>
                <br />a su mesa
              </h1>

              <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-lg">
                Productos del mar frescos y congelados de primera calidad. Salmón, mariscos, camarones y más — directo desde el Pacífico a tu hogar.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary font-bold hover:bg-white/90 shadow-lg px-8 gap-2 text-base"
                  asChild
                >
                  <Link to="/catalogo">
                    <ShoppingCart className="size-5" />
                    Comprar Ahora
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/15 backdrop-blur-sm px-8 gap-2 text-base"
                  asChild
                >
                  <Link to="/catalogo">
                    Ver Productos
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-10 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Shield className="size-5 text-primary" />
                  <span>Calidad Garantizada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-5 text-primary" />
                  <span>Despacho a Domicilio</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="size-5 text-primary" />
                  <span>+500 Clientes Felices</span>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative flex justify-center lg:justify-end animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 translate-y-8" />
                <img
                  src="/WhatsApp_Image_2026-05-15_at_7.15.28_AM.jpeg"
                  alt="123 Congelados - Todo lo que necesitas del mar"
                  className="relative max-w-full w-[520px] rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-16 block">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x divide-border">
            {[
              { icon: Fish, label: "Productos", value: "12+", desc: "Variedades frescas" },
              { icon: ThumbsUp, label: "Satisfacción", value: "99%", desc: "Clientes contentos" },
              { icon: Snowflake, label: "Cadena Frío", value: "-18°C", desc: "Temperatura constante" },
              { icon: Truck, label: "Despachos", value: "48h", desc: "Tiempo máximo" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center py-8 px-6 gap-1">
                <stat.icon className="size-6 text-primary mb-2" />
                <span className="text-3xl font-extrabold text-gradient-ocean">{stat.value}</span>
                <span className="text-sm font-semibold">{stat.label}</span>
                <span className="text-xs text-muted-foreground">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Nuestras Categorías
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Del Mar a Su Mesa
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Selección premium de productos marinos con cadena de frío garantizada
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo?cat=${cat.id}`}
              className="group"
            >
              <div className="glass dark:glass-dark rounded-2xl p-6 flex flex-col items-center gap-3 border border-border hover:border-primary/50 hover:shadow-ocean transition-all duration-300 group-hover:-translate-y-1">
                <span className="text-4xl">{cat.emoji}</span>
                <div className="text-center">
                  <p className="font-bold text-sm">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.desc}</p>
                </div>
                <ChevronRight className="size-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Destacados
              </Badge>
              <h2 className="text-4xl font-extrabold tracking-tight">
                Productos Estrella
              </h2>
              <p className="text-muted-foreground mt-2">
                Los preferidos por nuestros clientes
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex gap-2">
              <Link to="/catalogo">
                Ver Todo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Button asChild className="gap-2 bg-aqua-gradient text-white">
              <Link to="/catalogo">
                Ver todos los productos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Por Qué Elegirnos
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight">
            La diferencia 123 Congelados
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Snowflake,
              title: "Cadena de Frío Ininterrumpida",
              desc: "Mantenemos la temperatura de -18°C desde el origen hasta tu puerta. Calidad garantizada en cada paso.",
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-950/30",
            },
            {
              icon: Fish,
              title: "Pesca Responsable",
              desc: "Trabajamos con proveedores certificados que practican pesca sostenible en las aguas del Pacífico chileno.",
              color: "text-green-500",
              bg: "bg-green-50 dark:bg-green-950/30",
            },
            {
              icon: Award,
              title: "Calidad Premium",
              desc: "Solo los mejores cortes y calibres pasan nuestro estricto proceso de selección y control de calidad.",
              color: "text-yellow-500",
              bg: "bg-yellow-50 dark:bg-yellow-950/30",
            },
            {
              icon: Truck,
              title: "Despacho Rápido",
              desc: "Entrega en Santiago en 24-48 horas. Embalaje térmico especial para mantener la cadena de frío.",
              color: "text-purple-500",
              bg: "bg-purple-50 dark:bg-purple-950/30",
            },
            {
              icon: Shield,
              title: "Pago Seguro",
              desc: "Aceptamos tarjetas, transferencia y WhatsApp. Tus datos siempre protegidos.",
              color: "text-red-500",
              bg: "bg-red-50 dark:bg-red-950/30",
            },
            {
              icon: ThumbsUp,
              title: "Atención Personalizada",
              desc: "Equipo disponible por WhatsApp para asesorarte en tu compra y resolver cualquier consulta.",
              color: "text-cyan-500",
              bg: "bg-cyan-50 dark:bg-cyan-950/30",
            },
          ].map((item) => (
            <div key={item.title} className="group flex gap-5 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-ocean transition-all duration-300">
              <div className={`size-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <item.icon className={`size-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-ocean-gradient rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-white"
                  style={{
                    width: `${200 + i * 150}px`,
                    height: `${200 + i * 150}px`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
            <div className="relative">
              <Badge className="mb-6 bg-white/20 text-white border-white/30">
                ¡Contáctanos hoy!
              </Badge>
              <h2 className="text-4xl font-extrabold mb-4">
                ¿Listo para probar lo mejor del mar?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Contáctanos por WhatsApp y recibe asesoría personalizada. Envíos a toda la Región Metropolitana.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary font-bold hover:bg-white/90 px-8 gap-2"
                  asChild
                >
                  <Link to="/catalogo">
                    <ShoppingCart className="size-5" />
                    Ver Catálogo
                  </Link>
                </Button>
                <a
                  href="https://wa.me/56995387455"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/15 px-8 gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp +56 9 9538 7455
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
