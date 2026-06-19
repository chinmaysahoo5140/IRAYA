import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { listMyAddresses, addAddress, deleteAddress } from "@/lib/profile.functions";
import { toast } from "sonner";

const addressesQO = queryOptions({ queryKey: ["my-addresses"], queryFn: () => listMyAddresses() });

export const Route = createFileRoute("/_authenticated/account/addresses")({
  loader: ({ context }) => context.queryClient.ensureQueryData(addressesQO),
  head: () => ({ meta: [{ title: "Addresses — IRAYA" }] }),
  component: AddressesPage,
});

function AddressesPage() {
  const { data: addresses } = useSuspenseQuery(addressesQO);
  const qc = useQueryClient();
  const addFn = useServerFn(addAddress);
  const delFn = useServerFn(deleteAddress);
  const [busy, setBusy] = useState(false);

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      await addFn({
        data: {
          full_name: String(fd.get("full_name")),
          phone: String(fd.get("phone")),
          line1: String(fd.get("line1")),
          line2: String(fd.get("line2") ?? ""),
          city: String(fd.get("city")),
          state: String(fd.get("state")),
          pincode: String(fd.get("pincode")),
          country: "India",
        },
      });
      e.currentTarget.reset();
      qc.invalidateQueries({ queryKey: ["my-addresses"] });
      toast.success("Address saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    await delFn({ data: { id } });
    qc.invalidateQueries({ queryKey: ["my-addresses"] });
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-[1000px] px-6">
          <Link to="/account" className="text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal">
            ← Back to account
          </Link>
          <h1 className="mt-6 font-serif text-3xl md:text-4xl tracking-luxury">Addresses</h1>

          <div className="mt-10 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-[11px] tracking-luxury uppercase text-mute mb-6">Saved</h2>
              {addresses.length === 0 ? (
                <p className="text-mute text-sm">No saved addresses.</p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((a) => (
                    <div key={a.id} className="p-5 hairline-b text-sm">
                      <div className="font-serif text-base">{a.full_name}</div>
                      <div className="text-mute mt-1">
                        {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
                        {a.city}, {a.state} {a.pincode}<br />
                        {a.phone}
                      </div>
                      <button onClick={() => onDelete(a.id)} className="mt-3 text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={onAdd} className="space-y-4">
              <h2 className="text-[11px] tracking-luxury uppercase text-mute mb-6">Add new</h2>
              <Input name="full_name" label="Full name" required />
              <Input name="phone" label="Phone" required type="tel" />
              <Input name="line1" label="Address" required />
              <Input name="line2" label="Apt / Suite" />
              <div className="grid grid-cols-3 gap-3">
                <Input name="city" label="City" required />
                <Input name="state" label="State" required />
                <Input name="pincode" label="PIN" required />
              </div>
              <button type="submit" disabled={busy} className="w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50">
                {busy ? "Saving…" : "Save address"}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Input({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">{label}</span>
      <input name={name} type={type} required={required} className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" />
    </label>
  );
}
