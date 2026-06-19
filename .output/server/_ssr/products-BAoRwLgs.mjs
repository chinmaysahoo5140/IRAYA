import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { q as qo$1, m as adminUpsertProduct, n as adminSignImage, w as adminUploadImage, k as adminDeleteProduct } from "./router-B46y8PhA.mjs";
import { a as useSuspenseQuery, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as formatINR } from "./format-Sk5HC8SH.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { g as Plus, i as Pencil, j as Trash2, X, k as Upload } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/vercel__analytics.mjs";
import "./server-CUdO2dQu.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./auth-middleware-DBKcBFEt.mjs";
import "node:crypto";
import "../_libs/zod.mjs";
import "../_libs/goober.mjs";
function ProductsAdmin() {
  const {
    data: products
  } = useSuspenseQuery(qo$1);
  const [editing, setEditing] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const qc = useQueryClient();
  const deleteFn = useServerFn(adminDeleteProduct);
  async function onDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteFn({
        data: {
          id
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl tracking-luxury", children: "Products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCreating(true), className: "inline-flex items-center gap-2 bg-charcoal text-ivory px-5 py-2.5 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4", strokeWidth: 1.5 }),
        " New Product"
      ] })
    ] }),
    products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16 hairline-t hairline-b text-mute", children: 'No products yet. Click "New Product" to add the first one.' }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-t", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-4 hairline-b", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg truncate", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] tracking-wide-2 uppercase text-mute", children: [
          p.categories?.name ?? "—",
          " · Stock ",
          p.stock,
          " · ",
          p.status
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif", children: formatINR(p.price) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(p), className: "p-2 hover:text-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDelete(p.id), className: "p-2 hover:text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }, p.id)) }),
    (creating || editing) && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductDrawer, { product: editing, onClose: () => {
      setCreating(false);
      setEditing(null);
    }, onSaved: () => {
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      setCreating(false);
      setEditing(null);
    } })
  ] });
}
function ProductDrawer({
  product,
  onClose,
  onSaved
}) {
  const upsertFn = useServerFn(adminUpsertProduct);
  const signFn = useServerFn(adminSignImage);
  const uploadImageFn = useServerFn(adminUploadImage);
  const [saving, setSaving] = reactExports.useState(false);
  const initialPaths = (product?.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url);
  const [images, setImages] = reactExports.useState([]);
  reactExports.useState(() => {
    if (initialPaths.length === 0) return;
    Promise.all(initialPaths.map(async (path) => {
      if (path.startsWith("http")) return {
        path,
        previewUrl: path
      };
      const {
        url
      } = await signFn({
        data: {
          path
        }
      });
      return {
        path,
        previewUrl: url ?? ""
      };
    })).then(setImages);
  });
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }
  async function handleUpload(e) {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const base64Data = await fileToBase64(file);
        const res = await uploadImageFn({
          data: {
            base64Data,
            fileName: file.name,
            contentType: file.type
          }
        });
        setImages((prev) => [...prev, {
          path: res.path,
          previewUrl: res.url
        }]);
      } catch (err) {
        toast.error(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    e.target.value = "";
  }
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const discount = fd.get("discount_price") ? Number(fd.get("discount_price")) : null;
      await upsertFn({
        data: {
          id: product?.id,
          name: String(fd.get("name")),
          category_slug: fd.get("category_slug"),
          description: String(fd.get("description") ?? ""),
          price: Number(fd.get("price")),
          discount_price: discount,
          stock: Number(fd.get("stock")),
          status: fd.get("status") ?? "active",
          variants: String(fd.get("variants") ?? ""),
          images: images.map((i) => i.path)
        }
      });
      toast.success(product ? "Product updated" : "Product created");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  const cat = product?.categories?.slug ?? "bags";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/50 flex justify-end", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xl bg-background h-full overflow-y-auto p-8", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: product ? "Edit product" : "New product" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product name", name: "name", defaultValue: product?.name ?? "", required: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { name: "category_slug", defaultValue: cat, required: true, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bags", children: "Bags" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "footwear", children: "Footwear" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { name: "description", rows: 4, defaultValue: product?.description ?? "", className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Price (₹)", name: "price", type: "number", defaultValue: String(product?.price ?? ""), required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Discount price (₹)", name: "discount_price", type: "number", defaultValue: product?.discount_price ? String(product.discount_price) : "" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Stock", name: "stock", type: "number", defaultValue: String(product?.stock ?? "0"), required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { name: "status", defaultValue: product?.status ?? "active", className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "draft", children: "Draft" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "archived", children: "Archived" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sizes / variants (comma-separated, e.g. S, M, L)", name: "variants", defaultValue: "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Product images" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2 mb-3", children: [
          images.map((img) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square bg-secondary overflow-hidden", children: [
            img.previewUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img.previewUrl, alt: "", className: "h-full w-full object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setImages((prev) => prev.filter((i) => i.path !== img.path)), className: "absolute top-1 right-1 bg-charcoal text-ivory rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
          ] }, img.path)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "aspect-square hairline-b border-dashed border border-mute flex items-center justify-center cursor-pointer hover:bg-secondary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5 text-mute" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", multiple: true, onChange: handleUpload, className: "hidden" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-mute", children: "JPG or PNG, up to 8 images." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: saving, className: "w-full bg-charcoal text-ivory py-3 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: saving ? "Saving…" : product ? "Save changes" : "Create product" })
    ] })
  ] }) });
}
function Label({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children });
}
function Field({
  label,
  name,
  type = "text",
  defaultValue = "",
  required = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
      label,
      required && " *"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, type, required, defaultValue, step: type === "number" ? "0.01" : void 0, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
  ] });
}
export {
  ProductsAdmin as component
};
