import { useEffect, useMemo, useRef, useState } from "react";
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
const CATALOG_BRAND_IMAGE = "/catalogo123congelado.png";

type CatalogRow = {
  category: Category;
  product: string;
  detail: string;
  price: number;
  stock: number;
  unit: string;
  weight: string;
  badge?: string;
  image: string;
};

const loadCanvasImage = (src: string) => new Promise<HTMLImageElement | null>((resolve) => {
  if (!src) {
    resolve(null);
    return;
  }

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => resolve(image);
  image.onerror = () => resolve(null);
  image.src = src;
});

const roundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const fillRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, color: string) => {
  roundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
};

const strokeRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, color: string) => {
  roundedRect(ctx, x, y, width, height, radius);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
};

const drawWrappedText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 2) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      return;
    }
    if (currentLine) lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) lines.push(currentLine);

  lines.slice(0, maxLines).forEach((line, index) => {
    const finalLine = index === maxLines - 1 && lines.length > maxLines ? `${line.replace(/\s+\S+$/, "")}...` : line;
    ctx.fillText(finalLine, x, y + index * lineHeight);
  });
};

const drawCoverImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) => {
  const scale = Math.max(width / image.width, height / image.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = (image.height - sourceHeight) / 2;
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
};

export function AdminPriceList() {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(CATEGORIES);
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [exporting, setExporting] = useState<"png" | "jpeg" | "pdf" | null>(null);
  const priceSheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getProducts().then(setProducts).catch((error) => {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar productos");
    });
  }, []);

  const rows = useMemo<CatalogRow[]>(() => {
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
            image: product.image,
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
          image: product.image,
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

  const captureCatalogCanvas = async () => {
    const width = 1200;
    const margin = 56;
    const gap = 24;
    const columns = 3;
    const cardWidth = (width - margin * 2 - gap * (columns - 1)) / columns;
    const cardHeight = 390;
    const heroImageHeight = 696;
    const heroHeight = heroImageHeight + 120;
    let height = heroHeight + 90;

    for (const category of CATEGORIES) {
      const categoryRows = groupedRows[category] ?? [];
      if (categoryRows.length === 0) continue;
      height += 86 + Math.ceil(categoryRows.length / columns) * (cardHeight + gap) + 28;
    }
    height += 130;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No se pudo crear el canvas de exportación");

    const brandImage = await loadCanvasImage(CATALOG_BRAND_IMAGE);

    ctx.fillStyle = "#effaff";
    ctx.fillRect(0, 0, width, height);

    if (brandImage) {
      ctx.save();
      ctx.globalAlpha = 0.07;
      drawCoverImage(ctx, brandImage, 0, heroHeight - 40, width, height - heroHeight + 40);
      ctx.restore();

      fillRoundedRect(ctx, margin, 34, width - margin * 2, heroImageHeight, 34, "#ffffff");
      ctx.save();
      roundedRect(ctx, margin, 34, width - margin * 2, heroImageHeight, 34);
      ctx.clip();
      drawCoverImage(ctx, brandImage, margin, 34, width - margin * 2, heroImageHeight);
      ctx.restore();
      strokeRoundedRect(ctx, margin, 34, width - margin * 2, heroImageHeight, 34, "#082f49");
    }

    fillRoundedRect(ctx, margin, heroImageHeight + 58, width - margin * 2, 86, 30, "#020617");
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 34px Arial";
    ctx.fillText("Catálogo de productos disponibles", margin + 34, heroImageHeight + 112);
    ctx.fillStyle = "#67e8f9";
    ctx.font = "700 20px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Precios sujetos a stock", width - margin - 34, heroImageHeight + 112);
    ctx.textAlign = "left";

    let y = heroHeight + 76;
    for (const category of CATEGORIES) {
      const categoryRows = groupedRows[category] ?? [];
      if (categoryRows.length === 0) continue;

      const sectionHeight = 86 + Math.ceil(categoryRows.length / columns) * (cardHeight + gap);
      fillRoundedRect(ctx, margin, y, width - margin * 2, sectionHeight, 34, "#f8fafc");
      strokeRoundedRect(ctx, margin, y, width - margin * 2, sectionHeight, 34, "#bae6fd");

      fillRoundedRect(ctx, margin + 24, y + 24, 260, 42, 21, "#020617");
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 22px Arial";
      ctx.fillText(getCategoryLabel(category).toUpperCase(), margin + 48, y + 53);
      ctx.fillStyle = "#0e7490";
      ctx.font = "900 16px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`${categoryRows.length} opciones`, width - margin - 30, y + 51);
      ctx.textAlign = "left";

      await Promise.all(categoryRows.map((row, index) => loadCanvasImage(row.image).then((image) => ({ row, index, image })))).then((items) => {
        items.forEach(({ row, index, image }) => {
          const column = index % columns;
          const rowIndex = Math.floor(index / columns);
          const x = margin + 24 + column * (cardWidth + gap);
          const cardY = y + 86 + rowIndex * (cardHeight + gap);
          const imageHeight = 210;

          fillRoundedRect(ctx, x, cardY, cardWidth, cardHeight, 28, "#ffffff");
          strokeRoundedRect(ctx, x, cardY, cardWidth, cardHeight, 28, "#e0f2fe");
          ctx.save();
          roundedRect(ctx, x, cardY, cardWidth, imageHeight, 28);
          ctx.clip();
          if (image) {
            drawCoverImage(ctx, image, x, cardY, cardWidth, imageHeight);
          } else {
            ctx.fillStyle = "#e0f2fe";
            ctx.fillRect(x, cardY, cardWidth, imageHeight);
            ctx.fillStyle = "#0e7490";
            ctx.font = "900 22px Arial";
            ctx.textAlign = "center";
            ctx.fillText("123 Congelados", x + cardWidth / 2, cardY + 112);
            ctx.textAlign = "left";
          }
          ctx.restore();

          const gradient = ctx.createLinearGradient(0, cardY + 110, 0, cardY + imageHeight);
          gradient.addColorStop(0, "rgba(2, 6, 23, 0)");
          gradient.addColorStop(1, "rgba(2, 6, 23, 0.88)");
          ctx.fillStyle = gradient;
          ctx.fillRect(x, cardY + 90, cardWidth, 120);
          ctx.fillStyle = "#ffffff";
          ctx.font = "900 22px Arial";
          drawWrappedText(ctx, row.product, x + 20, cardY + 158, cardWidth - 40, 26, 2);

          ctx.fillStyle = "#64748b";
          ctx.font = "700 18px Arial";
          ctx.fillText(row.detail, x + 20, cardY + 250);
          ctx.font = "16px Arial";
          ctx.fillText(`${row.weight} · Stock ${row.stock}`, x + 20, cardY + 278);

          ctx.strokeStyle = "#e2e8f0";
          ctx.beginPath();
          ctx.moveTo(x + 20, cardY + 302);
          ctx.lineTo(x + cardWidth - 20, cardY + 302);
          ctx.stroke();

          ctx.fillStyle = "#0e7490";
          ctx.font = "900 34px Arial";
          ctx.fillText(formatCLP(row.price), x + 20, cardY + 348);
          ctx.fillStyle = "#64748b";
          ctx.font = "16px Arial";
          ctx.fillText(`/${row.unit}`, x + 20, cardY + 372);

          fillRoundedRect(ctx, x + cardWidth - 102, cardY + 334, 78, 34, 17, "#020617");
          ctx.fillStyle = "#ffffff";
          ctx.font = "900 15px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Pedir", x + cardWidth - 63, cardY + 357);
          ctx.textAlign = "left";
        });
      });

      y += sectionHeight + 28;
    }

    fillRoundedRect(ctx, margin, y + 10, width - margin * 2, 84, 26, "#ecfeff");
    ctx.fillStyle = "#0e7490";
    ctx.font = "900 24px Arial";
    ctx.fillText("Haz tu pedido por WhatsApp", margin + 30, y + 62);
    ctx.fillStyle = "#64748b";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Despacho rápido, seguro y confiable.", width - margin - 30, y + 62);
    ctx.textAlign = "left";

    return canvas;
  };

  const downloadImage = async (format: "png" | "jpeg") => {
    if (!priceSheetRef.current) return;
    setExporting(format);
    toast.info(`Generando ${format === "png" ? "PNG" : "JPG"}...`);

    try {
      const canvas = await captureCatalogCanvas();
      if (!canvas) return;
      const mime = format === "png" ? "image/png" : "image/jpeg";
      const extension = format === "png" ? "png" : "jpg";
      const url = canvas.toDataURL(mime, 0.95);
      const link = document.createElement("a");
      link.href = url;
      link.download = `catalogo-123congelados.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${format === "png" ? "PNG" : "JPG"} descargado`);
    } catch (error) {
      console.error("Error descargando catálogo como imagen", error);
      toast.error(error instanceof Error ? error.message : "No se pudo descargar la imagen");
    } finally {
      setExporting(null);
    }
  };

  const downloadPdf = async () => {
    if (!priceSheetRef.current) return;
    setExporting("pdf");
    toast.info("Generando PDF...");

    try {
      const canvas = await captureCatalogCanvas();
      if (!canvas) return;
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

      pdf.save("catalogo-123congelados.pdf");
      toast.success("PDF descargado");
    } catch (error) {
      console.error("Error descargando catálogo como PDF", error);
      toast.error(error instanceof Error ? error.message : "No se pudo descargar el PDF");
    } finally {
      setExporting(null);
    }
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
          <Button variant="outline" className="gap-2" disabled={!!exporting} onClick={() => downloadImage("png")}>
            <Download className="size-4" />
            {exporting === "png" ? "Generando..." : "Descargar PNG"}
          </Button>
          <Button variant="outline" className="gap-2" disabled={!!exporting} onClick={() => downloadImage("jpeg")}>
            <Download className="size-4" />
            {exporting === "jpeg" ? "Generando..." : "Descargar JPG"}
          </Button>
          <Button className="gap-2 bg-aqua-gradient text-white" disabled={!!exporting} onClick={downloadPdf}>
            <Printer className="size-4" />
            {exporting === "pdf" ? "Generando..." : "Descargar PDF"}
          </Button>
        </div>
      </div>

      <Card className="border-cyan-200 bg-cyan-50/60 shadow-ocean print:hidden">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-cyan-900">Preview del catálogo exportable</p>
          <p className="text-sm text-cyan-800/80">
            Esta pieza visual incluye las imágenes y precios actuales del sistema. Esto mismo se descarga como PNG, JPG o PDF.
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
        <div data-export-bg="topbar" className="h-3 bg-gradient-to-r from-cyan-500 via-sky-700 to-slate-950" />
        <div className="bg-cyan-50 p-4">
          <img
            src={CATALOG_BRAND_IMAGE}
            alt="123 Congelados"
            className="h-auto w-full rounded-[1.5rem] border-4 border-slate-950 object-cover"
          />
        </div>
        <div className="p-6">
        <div className="flex items-start justify-between gap-4 border-b border-sky-200 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <div data-export-bg="logo" className="size-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white">
                <Snowflake className="size-7" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">123 Congelados</p>
                <p data-export-color="cyan" className="text-sm font-semibold text-cyan-700">Catálogo Express Berry</p>
              </div>
            </div>
            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950">Precios del mar directo a tu hogar</h2>
            <p data-export-color="muted" className="mt-2 text-sm text-slate-600">Productos congelados, frescos y listos para tu pedido.</p>
          </div>
          <div data-export-bg="light" className="rounded-2xl bg-cyan-50 p-4 text-right">
            <p data-export-color="cyan" className="text-xs font-bold uppercase text-cyan-700">Pedidos</p>
            <p className="text-2xl font-black text-slate-950">+56 9 9538 7455</p>
            <p data-export-color="muted" className="text-xs text-slate-500">Precios sujetos a stock</p>
          </div>
        </div>

        <div className="mt-6 space-y-7">
          {CATEGORIES.map((category) => {
            const categoryRows = groupedRows[category] ?? [];
            if (categoryRows.length === 0) return null;
            return (
              <div key={category} data-export-bg="section" className="rounded-3xl border border-sky-100 bg-slate-50/80 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 data-export-bg="dark" className="rounded-full bg-slate-950 px-5 py-2 text-lg font-black uppercase tracking-wide text-white">
                    {getCategoryLabel(category)}
                  </h3>
                  <span data-export-color="cyan" className="text-xs font-bold uppercase tracking-wide text-cyan-700">
                    {categoryRows.length} opciones
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {categoryRows.map((row, index) => (
                    <div key={`${row.product}-${row.detail}-${index}`} className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={row.image}
                          alt={row.product}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover"
                        />
                        <div data-export-bg="dark" className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3">
                          <p data-export-color="white" className="line-clamp-2 text-sm font-black leading-tight text-white">{row.product}</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex min-h-12 items-start justify-between gap-2">
                          <div>
                            <p data-export-color="muted" className="text-xs font-semibold text-slate-500">{row.detail}</p>
                            <p data-export-color="muted" className="text-xs text-slate-400">{row.weight} · Stock {row.stock}</p>
                          </div>
                          {row.badge && <Badge data-export-bg="badge" className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">{row.badge}</Badge>}
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-100 pt-3">
                          <div>
                            <p data-export-color="cyan" className="text-2xl font-black text-cyan-700">{formatCLP(row.price)}</p>
                            <p data-export-color="muted" className="text-xs text-slate-500">/{row.unit}</p>
                          </div>
                          <span data-export-bg="dark" className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">Pedir</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div data-export-bg="light" className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-cyan-50 p-4">
          <div data-export-color="cyan" className="flex items-center gap-2 font-bold text-cyan-800">
            <MessageCircle className="size-5" />
            Haz tu pedido por WhatsApp
          </div>
          <p data-export-color="muted" className="text-sm text-slate-600">Despacho rápido, seguro y confiable.</p>
        </div>
        </div>
      </section>
    </div>
  );
}
