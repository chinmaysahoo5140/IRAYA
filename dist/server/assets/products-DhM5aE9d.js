import { jsxs, jsx } from "react/jsx-runtime";
import { q as qo, k as adminDeleteProduct, m as adminUpsertProduct, n as adminSignImage, w as adminUploadImage } from "./router-pa2HfNNz.js";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { f as formatINR } from "./format-Sk5HC8SH.js";
import "@tanstack/react-router";
import "@supabase/supabase-js";
import "react-hot-toast";
import "@vercel/analytics/react";
import "./server-C1RKXgFD.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./auth-middleware-HVhdhqZn.js";
import "node:crypto";
function ProductsAdmin() {
  const {
    data: products
  } = useSuspenseQuery(qo);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
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
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-10", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-4xl tracking-luxury", children: "Products" }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setCreating(true), className: "inline-flex items-center gap-2 bg-charcoal text-ivory px-5 py-2.5 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4", strokeWidth: 1.5 }),
        " New Product"
      ] })
    ] }),
    products.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-16 hairline-t hairline-b text-mute", children: 'No products yet. Click "New Product" to add the first one.' }) : /* @__PURE__ */ jsx("div", { className: "hairline-t", children: products.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 py-4 hairline-b", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "font-serif text-lg truncate", children: p.name }),
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] tracking-wide-2 uppercase text-mute", children: [
          p.categories?.name ?? "—",
          " · Stock ",
          p.stock,
          " · ",
          p.status
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "font-serif", children: formatINR(p.price) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setEditing(p), className: "p-2 hover:text-gold", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => onDelete(p.id), className: "p-2 hover:text-red-600", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }, p.id)) }),
    (creating || editing) && /* @__PURE__ */ jsx(ProductDrawer, { product: editing, onClose: () => {
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
  const [saving, setSaving] = useState(false);
  const initialPaths = (product?.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url);
  const [images, setImages] = useState([]);
  useState(() => {
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
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 flex justify-end", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xl bg-background h-full overflow-y-auto p-8", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl", children: product ? "Edit product" : "New product" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsx(Field, { label: "Product name", name: "name", defaultValue: product?.name ?? "", required: true }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Category" }),
        /* @__PURE__ */ jsxs("select", { name: "category_slug", defaultValue: cat, required: true, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none", children: [
          /* @__PURE__ */ jsx("option", { value: "bags", children: "Bags" }),
          /* @__PURE__ */ jsx("option", { value: "footwear", children: "Footwear" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsx("textarea", { name: "description", rows: 4, defaultValue: product?.description ?? "", className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(Field, { label: "Price (₹)", name: "price", type: "number", defaultValue: String(product?.price ?? ""), required: true }),
        /* @__PURE__ */ jsx(Field, { label: "Discount price (₹)", name: "discount_price", type: "number", defaultValue: product?.discount_price ? String(product.discount_price) : "" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(Field, { label: "Stock", name: "stock", type: "number", defaultValue: String(product?.stock ?? "0"), required: true }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Status" }),
          /* @__PURE__ */ jsxs("select", { name: "status", defaultValue: product?.status ?? "active", className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none", children: [
            /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
            /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
            /* @__PURE__ */ jsx("option", { value: "archived", children: "Archived" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Field, { label: "Sizes / variants (comma-separated, e.g. S, M, L)", name: "variants", defaultValue: "" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Product images" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2 mb-3", children: [
          images.map((img) => /* @__PURE__ */ jsxs("div", { className: "relative aspect-square bg-secondary overflow-hidden", children: [
            img.previewUrl && /* @__PURE__ */ jsx("img", { src: img.previewUrl, alt: "", className: "h-full w-full object-cover" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setImages((prev) => prev.filter((i) => i.path !== img.path)), className: "absolute top-1 right-1 bg-charcoal text-ivory rounded-full p-1", children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
          ] }, img.path)),
          /* @__PURE__ */ jsxs("label", { className: "aspect-square hairline-b border-dashed border border-mute flex items-center justify-center cursor-pointer hover:bg-secondary", children: [
            /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5 text-mute" }),
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", multiple: true, onChange: handleUpload, className: "hidden" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-mute", children: "JPG or PNG, up to 8 images." })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: saving, className: "w-full bg-charcoal text-ivory py-3 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: saving ? "Saving…" : product ? "Save changes" : "Create product" })
    ] })
  ] }) });
}
function Label({
  children
}) {
  return /* @__PURE__ */ jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children });
}
function Field({
  label,
  name,
  type = "text",
  defaultValue = "",
  required = false
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxs(Label, { children: [
      label,
      required && " *"
    ] }),
    /* @__PURE__ */ jsx("input", { name, type, required, defaultValue, step: type === "number" ? "0.01" : void 0, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
  ] });
}
export {
  ProductsAdmin as component
};
