import { Link } from "react-router-dom";
import { Fish, Phone, Globe, Mail, MapPin, Snowflake } from "lucide-react";

export function StorefrontFooter() {
  return (
    <footer className="bg-ocean-gradient text-white mt-20">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img
              src="/WhatsApp_Image_2026-05-15_at_7.15.28_AM.jpeg"
              alt="123 Congelados"
              className="h-16 w-auto object-contain mb-4 brightness-150"
            />
            <p className="text-sm text-white/70 leading-relaxed">
              Todo lo que necesita del mar, a su mesa. Productos frescos y congelados de la más alta calidad.
            </p>
            <div className="flex gap-3 mt-4">
              {["facebook", "instagram", "twitter", "linkedin"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="size-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="size-4 bg-white/70 rounded-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Fish className="size-4" /> Productos
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              {["Salmón Premium", "Camarones", "Mariscos", "Reineta", "Congelados Premium"].map((item) => (
                <li key={item}>
                  <Link to="/catalogo" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Snowflake className="size-4" /> Cadena de Frío
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              {["Nuestra Historia", "Proceso de Congelación", "Certificaciones", "Preguntas Frecuentes", "Política de Despacho"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary flex-shrink-0" />
                <a href="tel:+56995387455" className="hover:text-white transition-colors">
                  +56 9 9538 7455
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="size-4 text-primary flex-shrink-0" />
                <a href="https://www.123congelados.cl" className="hover:text-white transition-colors">
                  www.123congelados.cl
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary flex-shrink-0" />
                <span>contacto@123congelados.cl</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Santiago, Chile</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© 2025 123 Congelados. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/80 transition-colors">Términos y Condiciones</a>
            <a href="#" className="hover:text-white/80 transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
