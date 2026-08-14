import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Copy, Download, Printer, Snowflake, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getCategoryLabel, formatCLP } from "@/lib/data";
import type { Category } from "@/lib/data";
import { getProducts } from "@/lib/supabase-service";
import type { ProductWithVariants } from "@/lib/supabase-service";
import { toast } from "sonner";

const CATEGORIES: Category[] = ["salmon", "camarones", "mariscos", "reineta", "congelados"];

export function AdminPriceList() {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(CATEGORIES);
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const priceSheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getProducts().then(setProducts).catch((error) => {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar productos");
    });
  }, []);

  const rows = useMemo(() => {
    return products
      .filter((product) => selectedCategories.includes(product.category))
      .filter((product) => !onlyFeatured || product.featured)
      .flatMap((product) => {
        const variants = product.variants?.filter((variant) => variant.active) ?? [];
        if (variants.length > 0) {
          return variants.map((variant) => ({
            category: product.category,
            product: product.name,
            detail: variant.name,
            price: variant.price,
            stock: variant.stock,
            unit: variant.unit,
            weight: variant.weight,
            badge: product.badge,
          }));
        }

        return [{
          category: product.category,
          product: product.name,
          detail: product.weight,
          price: product.price,
          stock: product.stock,
          unit: product.unit,
          weight: product.weight,
          badge: product.badge,
        }];
      })
      .filter((row) => includeOutOfStock || row.stock > 0)
      .sort((a, b) => getCategoryLabel(a.category).localeCompare(getCategoryLabel(b.category)) || a.product.localeCompare(b.product));
  }, [includeOutOfStock, onlyFeatured, products, selectedCategories]);

  const groupedRows = useMemo(() => {
    return rows.reduce<Record<Category, typeof rows>>((acc, row) => {
      acc[row.category] = [...(acc[row.category] ?? []), row];
      return acc;
    }, {} as Record<Category, typeof rows>);
  }, [rows]);

  const whatsAppText = useMemo(() => {
    const lines = [
      "*123 Congelados*",
      "Precios del mar directo a tu hogar",
      "",
    ];

    for (const category of CATEGORIES) {
      const categoryRows = groupedRows[category] ?? [];
      if (categoryRows.length === 0) continue;
      lines.push(`*${getCategoryLabel(category)}*`);
      categoryRows.forEach((row) => {
        lines.push(`- ${row.product} ${row.detail}: ${formatCLP(row.price)} / ${row.unit}`);
      });
      lines.push("");
    }

    lines.push("Haz tu pedido por WhatsApp: +56 9 9538 7455");
    lines.push("Precios sujetos a stock disponible.");
    return lines.join("\n");
  }, [groupedRows]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(whatsAppText);
    toast.success("Texto copiado para WhatsApp");
  };

  const downloadImage = async (format: "png" | "jpeg") => {
    if (!priceSheetRef.current) return;

    const canvas = await html2canvas(priceSheetRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    const mime = format === "png" ? "image/png" : "image/jpeg";
    const extension = format === "png" ? "png" : "jpg";
    const url = canvas.toDataURL(mime, 0.95);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lista-express-123congelados.${extension}`;
    link.click();
  };

  const downloadPdf = async () => {
    if (!priceSheetRef.current) return;

    const canvas = await html2canvas(priceSheetRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    const imageData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageWidth = pageWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    let y = 0;

    if (imageHeight <= pageHeight) {
      pdf.addImage(imageData, "JPEG", 0, 0, imageWidth, imageHeight);
    } else {
      while (Math.abs(y) < imageHeight) {
        pdf.addImage(imageData, "JPEG", 0, y, imageWidth, imageHeight);
        y -= pageHeight;
        if (Math.abs(y) < imageHeight) pdf.addPage();
      }
    }

    pdf.save("lista-express-123congelados.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Lista Express</h1>
          <p className="text-muted-foreground mt-1">Genera una lista de precios publicitaria desde tus productos.</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" className="gap-2" onClick={copyText}>
            <Copy className="size-4" />
            Copiar WhatsApp
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => downloadImage("png")}>
            <Download className="size-4" />
            Descargar PNG
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => downloadImage("jpeg")}>
            <Download className="size-4" />
            Descargar JPG
          </Button>
          <Button className="gap-2 bg-aqua-gradient text-white" onClick={downloadPdf}>
            <Printer className="size-4" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <Card className="border-cyan-200 bg-cyan-50/60 shadow-ocean print:hidden">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-cyan-900">Vista previa de exportación</p>
          <p className="text-sm text-cyan-800/80">
            La pieza que ves abajo es exactamente lo que se descarga como PNG, JPG o PDF para enviar por WhatsApp.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-ocean border-0 print:hidden">
        <CardHeader>
          <CardTitle>Opciones</CardTitle>
          <CardDescription>Selecciona qué aparecerá en la pieza publicitaria.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <label key={category} className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
                <Checkbox checked={selectedCategories.includes(category)} onCheckedChange={() => toggleCategory(category)} />
                {getCategoryLabel(category)}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={includeOutOfStock} onCheckedChange={setIncludeOutOfStock} />
              <Label>Incluir sin stock</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={onlyFeatured} onCheckedChange={setOnlyFeatured} />
              <Label>Solo destacados</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <section ref={priceSheetRef} className="price-sheet mx-auto max-w-4xl overflow-hidden rounded-[2rem] border bg-white text-slate-950 shadow-ocean print:shadow-none print:border-0">
        <div className="h-3 bg-gradient-to-r from-cyan-500 via-sky-700 to-slate-950" />
        <div className="p-6">
        <div className="flex items-start justify-between gap-4 border-b border-sky-200 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white">
                <Snowflake className="size-7" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">123 Congelados</p>
                <p className="text-sm font-semibold text-cyan-700">Lista Express Berry</p>
              </div>
            </div>
            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950">Precios del mar directo a tu hogar</h2>
            <p className="mt-2 text-sm text-slate-600">Productos congelados, frescos y listos para tu pedido.</p>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-4 text-right">
            <p className="text-xs font-bold uppercase text-cyan-700">Pedidos</p>
            <p className="text-2xl font-black text-slate-950">+56 9 9538 7455</p>
            <p className="text-xs text-slate-500">Precios sujetos a stock</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {CATEGORIES.map((category) => {
            const categoryRows = groupedRows[category] ?? [];
            if (categoryRows.length === 0) return null;
            return (
              <div key={category} className="overflow-hidden rounded-2xl border border-sky-100">
                <div className="bg-slate-950 px-4 py-3 text-white">
                  <h3 className="text-lg font-black uppercase tracking-wide">{getCategoryLabel(category)}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {categoryRows.map((row, index) => (
                    <div key={`${row.product}-${row.detail}-${index}`} className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-950">{row.product}</p>
                          {row.badge && <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">{row.badge}</Badge>}
                        </div>
                        <p className="text-sm text-slate-500">{row.detail} · {row.weight} · Stock {row.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-cyan-700">{formatCLP(row.price)}</p>
                        <p className="text-xs text-slate-500">/{row.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-cyan-50 p-4">
          <div className="flex items-center gap-2 font-bold text-cyan-800">
            <MessageCircle className="size-5" />
            Haz tu pedido por WhatsApp
          </div>
          <p className="text-sm text-slate-600">Despacho rápido, seguro y confiable.</p>
        </div>
        </div>
      </section>
    </div>
  );
}
