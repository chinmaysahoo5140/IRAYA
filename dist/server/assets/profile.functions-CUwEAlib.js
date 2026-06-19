import { c as createServerRpc } from "./createServerRpc-BZ-1rN-j.js";
import { h as createServerFn } from "./server-C1RKXgFD.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-HVhdhqZn.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@supabase/supabase-js";
const getMyProfile_createServerFn_handler = createServerRpc({
  id: "5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479",
  name: "getMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getMyProfile.__executeServer(opts));
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyProfile_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("profiles").select("id, email, full_name, phone, avatar_url").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});
const updateMyProfile_createServerFn_handler = createServerRpc({
  id: "af00eb763dce352dc2f42ef901ef426a138feb40fdc7f79166552837a77fae5f",
  name: "updateMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
const updateMyProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  full_name: z.string().min(1).max(120).optional(),
  phone: z.string().max(20).optional()
}).parse(input)).handler(updateMyProfile_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("profiles").update(data).eq("id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listMyAddresses_createServerFn_handler = createServerRpc({
  id: "7fa8c91db179091ff6cb959e42809f454a284431c683e5e518b443a9cf593173",
  name: "listMyAddresses",
  filename: "src/lib/profile.functions.ts"
}, (opts) => listMyAddresses.__executeServer(opts));
const listMyAddresses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyAddresses_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("addresses").select("*").order("is_default", {
    ascending: false
  }).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const addressInput = z.object({
  full_name: z.string().min(1).max(120),
  phone: z.string().min(7).max(20),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(80),
  state: z.string().min(1).max(80),
  pincode: z.string().min(4).max(12),
  country: z.string().default("India"),
  label: z.string().max(40).optional(),
  is_default: z.boolean().optional()
});
const addAddress_createServerFn_handler = createServerRpc({
  id: "d0d3c71142e5936e54c42a3643c273b53a56fb29316e6fd26ccc3701adb52d6c",
  name: "addAddress",
  filename: "src/lib/profile.functions.ts"
}, (opts) => addAddress.__executeServer(opts));
const addAddress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => addressInput.parse(input)).handler(addAddress_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("addresses").insert({
    ...data,
    user_id: userId
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteAddress_createServerFn_handler = createServerRpc({
  id: "598ff4ff45ff4238adf216e3a30144469c96c670c2c02a41b0509bab983d63a3",
  name: "deleteAddress",
  filename: "src/lib/profile.functions.ts"
}, (opts) => deleteAddress.__executeServer(opts));
const deleteAddress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  id: z.string().uuid()
}).parse(input)).handler(deleteAddress_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("addresses").delete().eq("id", data.id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listMyWishlist_createServerFn_handler = createServerRpc({
  id: "38c174375dacd7a92e9e6050d22909885db1125a7f3c109afcf8e5a28f5e2942",
  name: "listMyWishlist",
  filename: "src/lib/profile.functions.ts"
}, (opts) => listMyWishlist.__executeServer(opts));
const listMyWishlist = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyWishlist_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("wishlist").select("product_id, products(id, slug, name, price, product_images(url, sort_order))").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const toggleWishlist_createServerFn_handler = createServerRpc({
  id: "802683fc68d58adcbd14e37e9cea4215fce0391f5b8001fdebe9b23283676a24",
  name: "toggleWishlist",
  filename: "src/lib/profile.functions.ts"
}, (opts) => toggleWishlist.__executeServer(opts));
const toggleWishlist = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  productId: z.string().uuid()
}).parse(input)).handler(toggleWishlist_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: existing
  } = await supabase.from("wishlist").select("id").eq("user_id", userId).eq("product_id", data.productId).maybeSingle();
  if (existing) {
    await supabase.from("wishlist").delete().eq("id", existing.id);
    return {
      in: false
    };
  }
  await supabase.from("wishlist").insert({
    user_id: userId,
    product_id: data.productId
  });
  return {
    in: true
  };
});
const getMyRoles_createServerFn_handler = createServerRpc({
  id: "addc11dc1fc307c89bfb435d49d20159f73b0c39d6063512ac456398fc06b87e",
  name: "getMyRoles",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getMyRoles.__executeServer(opts));
const getMyRoles = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyRoles_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.role);
});
export {
  addAddress_createServerFn_handler,
  deleteAddress_createServerFn_handler,
  getMyProfile_createServerFn_handler,
  getMyRoles_createServerFn_handler,
  listMyAddresses_createServerFn_handler,
  listMyWishlist_createServerFn_handler,
  toggleWishlist_createServerFn_handler,
  updateMyProfile_createServerFn_handler
};
