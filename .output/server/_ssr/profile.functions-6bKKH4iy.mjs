import { c as createServerRpc } from "./createServerRpc-T01JzlKW.mjs";
import { c as createServerFn } from "./server-CUdO2dQu.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DBKcBFEt.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
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
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  full_name: stringType().min(1).max(120).optional(),
  phone: stringType().max(20).optional()
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
const addressInput = objectType({
  full_name: stringType().min(1).max(120),
  phone: stringType().min(7).max(20),
  line1: stringType().min(1).max(200),
  line2: stringType().max(200).optional(),
  city: stringType().min(1).max(80),
  state: stringType().min(1).max(80),
  pincode: stringType().min(4).max(12),
  country: stringType().default("India"),
  label: stringType().max(40).optional(),
  is_default: booleanType().optional()
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
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  id: stringType().uuid()
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
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  productId: stringType().uuid()
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
