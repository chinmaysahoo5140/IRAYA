import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Plus, Trash2, Pencil, X, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  adminListProducts,
  adminUpsertProduct,
  adminDeleteProduct,
  adminSignImage,
  adminUploadImage,
} from "@/lib/admin.functions";
import { formatINR } from "@/lib/format";

const qo = queryOptions({ queryKey: ["admin-products"], queryFn: () => adminListProducts() });

type ProductRow = Awaited<ReturnType<typeof adminListProducts>>[number];

export const Route = createFileRoute("/_authenticated/admin/products")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  head: () => ({ meta: [{ title: "Admin · Products — IRAYA" }] }),
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const { data: products } = useSuspenseQuery(qo);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [creating, setCreating] = useState(false);
  const qc = useQueryClient();
  const deleteFn = useServerFn(adminDeleteProduct);

  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteFn({ data: { id } });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-4xl tracking-luxury">Products</h1>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 bg-charcoal text-ivory px-5 py-2.5 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} /> New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 hairline-t hairline-b text-mute">
          No products yet. Click "New Product" to add the first one.
        </div>
      ) : (
        <div className="hairline-t">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 py-4 hairline-b">
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg truncate">{p.name}</div>
                <div className="text-[11px] tracking-wide-2 uppercase text-mute">
                  {(p.categories as { name?: string } | null)?.name ?? "—"} · Stock {p.stock} · {p.status}
                </div>
              </div>
              <div className="font-serif">{formatINR(p.price)}</div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(p)} className="p-2 hover:text-gold"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => onDelete(p.id)} className="p-2 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <ProductDrawer
          product={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-products"] });
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProductDrawer({
  product,
  onClose,
  onSaved,
}: {
  product: ProductRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const upsertFn = useServerFn(adminUpsertProduct);
  const signFn = useServerFn(adminSignImage);
  const uploadImageFn = useServerFn(adminUploadImage);
  const [saving, setSaving] = useState(false);
  const initialPaths: string[] = (product?.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url as string);
  const [images, setImages] = useState<{ path: string; previewUrl: string }[]>([]);

  // hydrate previews for existing images
  useState(() => {
    if (initialPaths.length === 0) return;
    Promise.all(
      initialPaths.map(async (path) => {
        if (path.startsWith("http")) return { path, previewUrl: path };
        const { url } = await signFn({ data: { path } });
        return { path, previewUrl: url ?? "" };
      }),
    ).then(setImages);
  });

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const base64Data = await fileToBase64(file);
        const res = await uploadImageFn({
          data: {
            base64Data,
            fileName: file.name,
            contentType: file.type,
          }
        });
        setImages((prev) => [...prev, { path: res.path, previewUrl: res.url }]);
      } catch (err) {
        toast.error(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    e.target.value = "";
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const discount = fd.get("discount_price") ? Number(fd.get("discount_price")) : null;
      await upsertFn({
        data: {
          id: product?.id,
          name: String(fd.get("name")),
          category_slug: fd.get("category_slug") as "bags" | "footwear",
          description: String(fd.get("description") ?? ""),
          price: Number(fd.get("price")),
          discount_price: discount,
          stock: Number(fd.get("stock")),
          status: (fd.get("status") as "draft" | "active" | "archived") ?? "active",
          variants: String(fd.get("variants") ?? ""),
          images: images.map((i) => i.path),
        },
      });
      toast.success(product ? "Product updated" : "Product created");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const cat = (product?.categories as { slug?: string } | null)?.slug ?? "bags";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-background h-full overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl">{product ? "Edit product" : "New product"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <Field label="Product name" name="name" defaultValue={product?.name ?? ""} required />

          <div>
            <Label>Category</Label>
            <select name="category_slug" defaultValue={cat} required className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none">
              <option value="bags">Bags</option>
              <option value="footwear">Footwear</option>
            </select>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              rows={4}
              defaultValue={(product as { description?: string } | null)?.description ?? ""}
              className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₹)" name="price" type="number" defaultValue={String(product?.price ?? "")} required />
            <Field label="Discount price (₹)" name="discount_price" type="number" defaultValue={product?.discount_price ? String(product.discount_price) : ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock" name="stock" type="number" defaultValue={String(product?.stock ?? "0")} required />
            <div>
              <Label>Status</Label>
              <select name="status" defaultValue={product?.status ?? "active"} className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <Field label="Sizes / variants (comma-separated, e.g. S, M, L)" name="variants" defaultValue="" />

          {/* Images */}
          <div>
            <Label>Product images</Label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {images.map((img) => (
                <div key={img.path} className="relative aspect-square bg-secondary overflow-hidden">
                  {img.previewUrl && <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />}
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((i) => i.path !== img.path))}
                    className="absolute top-1 right-1 bg-charcoal text-ivory rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square hairline-b border-dashed border border-mute flex items-center justify-center cursor-pointer hover:bg-secondary">
                <Upload className="h-5 w-5 text-mute" />
                <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
              </label>
            </div>
            <p className="text-[11px] text-mute">JPG or PNG, up to 8 images.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-charcoal text-ivory py-3 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">{children}</span>;
}

function Field({ label, name, type = "text", defaultValue = "", required = false }: { label: string; name: string; type?: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="block">
      <Label>{label}{required && " *"}</Label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        step={type === "number" ? "0.01" : undefined}
        className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal"
      />
    </label>
  );
}
