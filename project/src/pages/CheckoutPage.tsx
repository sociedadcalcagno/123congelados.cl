import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, Smartphone, Banknote, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { formatCLP } from "@/lib/data";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { id: "card", label: "Tarjeta de Crédito/Débito", icon: CreditCard },
  { id: "transfer", label: "Transferencia Bancaria", icon: Banknote },
  { id: "whatsapp", label: "Confirmar por WhatsApp", icon: Smartphone },
];

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("whatsapp");
  const [submitted, setSubmitted] = useState(false);
  const cartTotal = total();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "Santiago", notes: "",
  });

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
        <p className="text-muted-foreground">Agrega productos antes de ir al checkout</p>
        <Button asChild className="bg-aqua-gradient text-white">
          <Link to="/catalogo">Ver Catálogo</Link>
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center px-4 py-20">
        <div className="size-24 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center animate-float">
          <CheckCircle className="size-12 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold mb-3">¡Pedido Recibido!</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Hemos recibido tu pedido. Nos contactaremos contigo en breve para confirmar el despacho.
          </p>
        </div>
        <div className="glass dark:glass-dark rounded-2xl p-6 max-w-sm w-full text-left space-y-2">
          <p className="text-sm"><span className="font-medium">Nombre:</span> {form.name}</p>
          <p className="text-sm"><span className="font-medium">Total:</span> {formatCLP(cartTotal)}</p>
          <p className="text-sm"><span className="font-medium">Pago:</span> {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</p>
          <p className="text-sm"><span className="font-medium">Dirección:</span> {form.address}</p>
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <Button asChild className="bg-aqua-gradient text-white gap-2">
            <Link to="/catalogo">
              Seguir Comprando
            </Link>
          </Button>
          <a
            href={`https://wa.me/56995387455?text=Hola! Acabo de hacer un pedido. Nombre: ${form.name}, Total: ${formatCLP(cartTotal)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2 border-green-500 text-green-600">
              <svg viewBox="0 0 24 24" className="size-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirmar por WhatsApp
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }
    clearCart();
    setSubmitted(true);
    toast.success("¡Pedido enviado exitosamente!");
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/catalogo">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold">Finalizar Pedido</h1>
            <p className="text-muted-foreground">Completa tu información de despacho</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                    Datos de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      placeholder="María González"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      placeholder="+56 9 1234 5678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                    Dirección de Despacho
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      placeholder="Av. Providencia 1234, Dpto 201"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas adicionales</Label>
                    <Input
                      id="notes"
                      placeholder="Instrucciones de entrega, horario preferido..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 text-sm">
                    <Truck className="size-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300">Despacho a Domicilio</p>
                      <p className="text-blue-600 dark:text-blue-400">Coordinaremos el horario por WhatsApp. Región Metropolitana.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      <div className={`size-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === method.id ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <method.icon className={`size-5 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <span className="font-medium">{method.label}</span>
                      {paymentMethod === method.id && (
                        <CheckCircle className="size-5 text-primary ml-auto" />
                      )}
                    </label>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="size-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity} {item.product.unit}</p>
                        </div>
                        <span className="text-sm font-semibold flex-shrink-0">
                          {formatCLP(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCLP(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Despacho</span>
                        <span className="text-green-600 font-medium">A coordinar</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-gradient-ocean">{formatCLP(cartTotal)}</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-aqua-gradient text-white font-bold hover:opacity-90 transition-opacity py-6 text-base"
                    >
                      Confirmar Pedido
                    </Button>

                    <Badge className="w-full justify-center py-2 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50">
                      Cadena de frío garantizada
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
