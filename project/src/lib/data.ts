export type Category = "salmon" | "mariscos" | "camarones" | "reineta" | "congelados";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  stock: number;
  minStock: number;
  unit: string;
  weight: string;
  image: string;
  description: string;
  featured: boolean;
  badge?: string;
  origin: string;
  coldChain: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: "pendiente" | "confirmado" | "en_despacho" | "entregado" | "cancelado";
  date: string;
  paymentMethod: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "activo" | "inactivo";
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: "entrada" | "salida" | "ajuste";
  quantity: number;
  date: string;
  reason: string;
  user: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Salmón Atlántico Premium",
    category: "salmon",
    price: 18990,
    originalPrice: 22990,
    stock: 45,
    minStock: 10,
    unit: "kg",
    weight: "1 kg",
    image: "/product-salmon.webp",
    description: "Salmón atlántico fresco de primera calidad, capturado en aguas frías de la Patagonia chilena. Ideal para sushi, ceviche o a la plancha.",
    featured: true,
    badge: "Más Vendido",
    origin: "Patagonia, Chile",
    coldChain: true,
  },
  {
    id: "p2",
    name: "Filetes de Salmón Ahumado",
    category: "salmon",
    price: 24990,
    stock: 28,
    minStock: 8,
    unit: "paq",
    weight: "500g",
    image: "/product-salmon.webp",
    description: "Filetes de salmón ahumado al frío con sal marina artesanal. Proceso artesanal sin conservantes artificiales.",
    featured: true,
    badge: "Premium",
    origin: "Puerto Montt, Chile",
    coldChain: true,
  },
  {
    id: "p3",
    name: "Camarones Ecuatorianos",
    category: "camarones",
    price: 15990,
    originalPrice: 19990,
    stock: 60,
    minStock: 15,
    unit: "kg",
    weight: "1 kg",
    image: "/product-camarones.webp",
    description: "Camarones jumbo enteros congelados IQF. Calibre 16/20. Perfectos para cocteles, paella y mariscos al ajillo.",
    featured: true,
    badge: "Oferta",
    origin: "Ecuador",
    coldChain: true,
  },
  {
    id: "p4",
    name: "Camarones Pelados XL",
    category: "camarones",
    price: 19990,
    stock: 35,
    minStock: 10,
    unit: "kg",
    weight: "1 kg",
    image: "/product-camarones.webp",
    description: "Camarones pelados y desvenados congelados XL. Calibre 31/40. Listos para cocinar.",
    featured: false,
    origin: "Ecuador",
    coldChain: true,
  },
  {
    id: "p5",
    name: "Reineta Fresca Entera",
    category: "reineta",
    price: 9990,
    stock: 20,
    minStock: 5,
    unit: "kg",
    weight: "1 kg",
    image: "/product-reineta.webp",
    description: "Reineta fresca del Pacífico chileno. Pescado de carne blanca y textura suave. Ideal para caldo, al horno o frita.",
    featured: true,
    badge: "Fresco",
    origin: "Valparaíso, Chile",
    coldChain: true,
  },
  {
    id: "p6",
    name: "Filetes de Reineta",
    category: "reineta",
    price: 12990,
    stock: 15,
    minStock: 5,
    unit: "kg",
    weight: "1 kg",
    image: "/product-reineta.webp",
    description: "Filetes limpios de reineta sin espinas. Listos para cocinar. Ideales para empanizados y al vapor.",
    featured: false,
    origin: "Chile",
    coldChain: true,
  },
  {
    id: "p7",
    name: "Mix de Mariscos Premium",
    category: "mariscos",
    price: 22990,
    stock: 25,
    minStock: 8,
    unit: "kg",
    weight: "1 kg",
    image: "/product-mariscos.webp",
    description: "Mix seleccionado de mariscos frescos: cholgas, choritos, jaibas y camarones. Perfecto para paella y pastas.",
    featured: true,
    badge: "Nuevo",
    origin: "Chile",
    coldChain: true,
  },
  {
    id: "p8",
    name: "Cholgas al Natural",
    category: "mariscos",
    price: 8990,
    stock: 40,
    minStock: 10,
    unit: "kg",
    weight: "1 kg",
    image: "/product-mariscos.webp",
    description: "Cholgas chilenas limpias y cocidas al vapor. Sin aditivos. Excelente fuente de proteínas y omega 3.",
    featured: false,
    origin: "Chiloé, Chile",
    coldChain: true,
  },
  {
    id: "p9",
    name: "Pack Congelados Premium",
    category: "congelados",
    price: 44990,
    originalPrice: 55990,
    stock: 12,
    minStock: 5,
    unit: "pack",
    weight: "3 kg",
    image: "/product-congelados.webp",
    description: "Pack premium con 1kg salmón + 1kg camarones + 1kg mix mariscos. Cadena de frío garantizada. Ideal para regalo.",
    featured: true,
    badge: "Pack Ahorro",
    origin: "Chile",
    coldChain: true,
  },
  {
    id: "p10",
    name: "Merluza Filetes Congelados",
    category: "congelados",
    price: 7990,
    stock: 55,
    minStock: 20,
    unit: "kg",
    weight: "1 kg",
    image: "/product-congelados.webp",
    description: "Filetes de merluza congelados IQF. Sin piel ni espinas. Producto 100% natural sin fosfatos.",
    featured: false,
    origin: "Chile",
    coldChain: true,
  },
  {
    id: "p11",
    name: "Salmón Porciones 200g",
    category: "salmon",
    price: 5990,
    stock: 80,
    minStock: 20,
    unit: "paq",
    weight: "200g",
    image: "/product-salmon.webp",
    description: "Porciones individuales de salmón listas para cocinar. Porción perfecta para 1 persona.",
    featured: false,
    origin: "Chile",
    coldChain: true,
  },
  {
    id: "p12",
    name: "Calamar Entero Limpio",
    category: "mariscos",
    price: 11990,
    stock: 3,
    minStock: 8,
    unit: "kg",
    weight: "1 kg",
    image: "/product-mariscos.webp",
    description: "Calamar del Pacífico limpio y sin tinta. Perfecto para a la plancha, frito o en arroz.",
    featured: false,
    origin: "Perú/Chile",
    coldChain: true,
  },
];

export const ORDERS: Order[] = [
  {
    id: "ORD-2025-001",
    customer: "María González",
    email: "maria.gonzalez@gmail.com",
    phone: "+56 9 8765 4321",
    address: "Av. Providencia 1234, Santiago",
    items: [
      { productId: "p1", quantity: 2, price: 18990, name: "Salmón Atlántico Premium" },
      { productId: "p3", quantity: 1, price: 15990, name: "Camarones Ecuatorianos" },
    ],
    total: 53970,
    status: "entregado",
    date: "2025-05-14",
    paymentMethod: "Tarjeta",
  },
  {
    id: "ORD-2025-002",
    customer: "Carlos Rodríguez",
    email: "carlos.rod@outlook.com",
    phone: "+56 9 7654 3210",
    address: "Las Condes 567, Santiago",
    items: [
      { productId: "p9", quantity: 1, price: 44990, name: "Pack Congelados Premium" },
    ],
    total: 44990,
    status: "en_despacho",
    date: "2025-05-14",
    paymentMethod: "Transferencia",
  },
  {
    id: "ORD-2025-003",
    customer: "Ana Martínez",
    email: "ana.mtz@gmail.com",
    phone: "+56 9 6543 2109",
    address: "Ñuñoa 890, Santiago",
    items: [
      { productId: "p2", quantity: 2, price: 24990, name: "Filetes de Salmón Ahumado" },
      { productId: "p7", quantity: 1, price: 22990, name: "Mix de Mariscos Premium" },
    ],
    total: 72970,
    status: "confirmado",
    date: "2025-05-15",
    paymentMethod: "Tarjeta",
  },
  {
    id: "ORD-2025-004",
    customer: "Luis Pérez",
    email: "lperez@hotmail.com",
    phone: "+56 9 5432 1098",
    address: "Vitacura 2345, Santiago",
    items: [
      { productId: "p5", quantity: 3, price: 9990, name: "Reineta Fresca Entera" },
      { productId: "p4", quantity: 2, price: 19990, name: "Camarones Pelados XL" },
    ],
    total: 69950,
    status: "pendiente",
    date: "2025-05-15",
    paymentMethod: "WhatsApp",
  },
  {
    id: "ORD-2025-005",
    customer: "Patricia Silva",
    email: "patricia.silva@gmail.com",
    phone: "+56 9 4321 0987",
    address: "Maipú 3456, Santiago",
    items: [
      { productId: "p1", quantity: 1, price: 18990, name: "Salmón Atlántico Premium" },
      { productId: "p3", quantity: 2, price: 15990, name: "Camarones Ecuatorianos" },
      { productId: "p8", quantity: 1, price: 8990, name: "Cholgas al Natural" },
    ],
    total: 59960,
    status: "entregado",
    date: "2025-05-13",
    paymentMethod: "Transferencia",
  },
];

export const CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "María González",
    email: "maria.gonzalez@gmail.com",
    phone: "+56 9 8765 4321",
    address: "Av. Providencia 1234, Santiago",
    totalOrders: 8,
    totalSpent: 285600,
    lastOrder: "2025-05-14",
    status: "activo",
  },
  {
    id: "c2",
    name: "Carlos Rodríguez",
    email: "carlos.rod@outlook.com",
    phone: "+56 9 7654 3210",
    address: "Las Condes 567, Santiago",
    totalOrders: 5,
    totalSpent: 198450,
    lastOrder: "2025-05-14",
    status: "activo",
  },
  {
    id: "c3",
    name: "Ana Martínez",
    email: "ana.mtz@gmail.com",
    phone: "+56 9 6543 2109",
    address: "Ñuñoa 890, Santiago",
    totalOrders: 12,
    totalSpent: 421800,
    lastOrder: "2025-05-15",
    status: "activo",
  },
  {
    id: "c4",
    name: "Luis Pérez",
    email: "lperez@hotmail.com",
    phone: "+56 9 5432 1098",
    address: "Vitacura 2345, Santiago",
    totalOrders: 3,
    totalSpent: 89900,
    lastOrder: "2025-05-15",
    status: "activo",
  },
  {
    id: "c5",
    name: "Patricia Silva",
    email: "patricia.silva@gmail.com",
    phone: "+56 9 4321 0987",
    address: "Maipú 3456, Santiago",
    totalOrders: 6,
    totalSpent: 156700,
    lastOrder: "2025-05-13",
    status: "activo",
  },
];

export const INVENTORY_MOVEMENTS: InventoryMovement[] = [
  { id: "m1", productId: "p1", productName: "Salmón Atlántico Premium", type: "entrada", quantity: 50, date: "2025-05-14", reason: "Reabastecimiento proveedor", user: "Admin" },
  { id: "m2", productId: "p3", productName: "Camarones Ecuatorianos", type: "salida", quantity: 15, date: "2025-05-14", reason: "Venta ORD-2025-001", user: "Sistema" },
  { id: "m3", productId: "p9", productName: "Pack Congelados Premium", type: "entrada", quantity: 20, date: "2025-05-13", reason: "Reabastecimiento proveedor", user: "Admin" },
  { id: "m4", productId: "p12", productName: "Calamar Entero Limpio", type: "ajuste", quantity: -5, date: "2025-05-12", reason: "Merma por vencimiento", user: "Admin" },
  { id: "m5", productId: "p5", productName: "Reineta Fresca Entera", type: "salida", quantity: 10, date: "2025-05-12", reason: "Venta ORD-2025-005", user: "Sistema" },
];

export const SALES_DATA = [
  { month: "Nov", ventas: 1850000, pedidos: 38 },
  { month: "Dic", ventas: 2940000, pedidos: 62 },
  { month: "Ene", ventas: 2200000, pedidos: 45 },
  { month: "Feb", ventas: 1980000, pedidos: 41 },
  { month: "Mar", ventas: 2650000, pedidos: 54 },
  { month: "Abr", ventas: 3100000, pedidos: 67 },
  { month: "May", ventas: 3450000, pedidos: 72 },
];

export const CATEGORY_SALES = [
  { name: "Salmón", value: 38, color: "var(--chart-1)" },
  { name: "Camarones", value: 25, color: "var(--chart-2)" },
  { name: "Mariscos", value: 18, color: "var(--chart-3)" },
  { name: "Congelados", value: 12, color: "var(--chart-4)" },
  { name: "Reineta", value: 7, color: "var(--chart-5)" },
];

export const formatCLP = (amount: number): string => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getCategoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    salmon: "Salmón",
    mariscos: "Mariscos",
    camarones: "Camarones",
    reineta: "Reineta",
    congelados: "Congelados Premium",
  };
  return labels[category];
};

export const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  confirmado: { label: "Confirmado", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  en_despacho: { label: "En Despacho", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  entregado: { label: "Entregado", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};
