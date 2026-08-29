/* HoodieRSA Checkout — clear, editorial checkout with manual address fallback and PayFast sandbox-ready handoff. */
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, LockKeyhole, MapPin, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useCart, getCartProduct } from "@/contexts/CartContext";
import { getPrice } from "@shared/catalog";
import { MapView } from "@/components/Map";
import { trpc } from "@/lib/trpc";

const PROVINCES = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"];

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [mapReady, setMapReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [submitError, setSubmitError] = useState("");
  const createOrder = trpc.commerce.createOrder.useMutation();
  const preparePayfast = trpc.commerce.preparePayfast.useMutation();
  const addressRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", suburb: "", city: "", province: "", postal: "" });
  const shipping = items.length ? 60 : 0;
  const total = subtotal + shipping;
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submitOrder = async () => {
    try {
      setSubmitError("");
      const result = await createOrder.mutateAsync({
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        province: form.province,
        postalCode: form.postal,
        shippingAddress: `${form.address}, ${form.suburb}, ${form.city}`,
        subtotal,
        shippingFee: shipping,
        total,
        items: items.map((item) => { const product = getCartProduct(item.productSlug)!; return { productSlug: item.productSlug, productName: product.name, colorway: item.colorway, size: item.size.trim().toUpperCase(), quantity: item.quantity, unitPrice: getPrice(product.slug, item.size) }; }),
      });
      const payment = await preparePayfast.mutateAsync({ amount: total, orderNumber: result.orderNumber, name: form.name, email: form.email, phone: form.phone });
      if (!payment.configured) throw new Error("PayFast sandbox credentials are not configured yet");
      const paymentForm = document.createElement("form");
      paymentForm.method = "POST";
      paymentForm.action = payment.endpoint;
      paymentForm.style.display = "none";
      Object.entries(payment.fields).forEach(([name, value]) => { const input = document.createElement("input"); input.type = "hidden"; input.name = name; input.value = value; paymentForm.appendChild(input); });
      document.body.appendChild(paymentForm);
      paymentForm.submit();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("ORDER_PERSISTENCE_UNAVAILABLE")) setSubmitError("Orders are temporarily unavailable. Please try again in a moment.");
      else if (message.toLowerCase().includes("payfast")) setSubmitError("Your order was saved, but secure PayFast checkout is not ready yet. Please try again shortly.");
      else setSubmitError("We could not start checkout. Please check your details and try again.");
    }
  };

  const handleMap = (map: google.maps.Map) => {
    setMapReady(true);
    if (!addressRef.current) return;
    const autocomplete = new google.maps.places.Autocomplete(addressRef.current, { types: ["address"], componentRestrictions: { country: "za" } });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) update("address", place.formatted_address);
      if (place.geometry?.location) map.panTo(place.geometry.location);
    });
  };

  if (submitted) return <main className="grid min-h-screen place-items-center bg-[#11100f] px-5 text-[#f7f3e9]"><div className="max-w-md text-center"><div className="mx-auto grid size-20 place-items-center rounded-full bg-[#B5342E]"><ShieldCheck size={38} /></div><p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#EFA8C4]">Order received</p><h1 className="mt-3 font-display text-6xl uppercase leading-none">Keep an eye<br />on your inbox.</h1><p className="mt-6 text-sm leading-relaxed text-[#f7f3e9]/70">Your order request {orderNumber ? `(${orderNumber}) ` : ""}is saved as a PayFast-ready checkout. We’ll send a confirmation once payment is verified.</p><button onClick={() => navigate("/")} className="mt-8 border border-[#f7f3e9]/30 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] hover:bg-white/10">Back to the drop</button></div></main>;

  return (
    <main className="min-h-screen bg-[#11100f] text-[#f7f3e9]">
      <header className="flex items-center justify-between border-b border-[#f7f3e9]/20 px-4 py-5 sm:px-8"><button onClick={() => window.history.back()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] hover:opacity-60"><ArrowLeft size={16} /> Back</button><p className="font-display text-xl tracking-[-0.03em]">HOODIE<span className="text-[#B5342E]">/</span>RSA</p><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f7f3e9]/60">Secure checkout</span></header>
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:py-16">
        <section>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EFA8C4]">01 — Details</p><h1 className="mt-4 font-display text-6xl uppercase leading-[0.82] tracking-[-0.03em]">Make it<br /><span className="text-[#B5342E]">yours.</span></h1>
          {items.length === 0 ? <div className="mt-10 border border-dashed border-[#f7f3e9]/25 p-8 text-sm text-[#f7f3e9]/60">Your cart is empty. <button onClick={() => navigate("/")} className="text-[#EFA8C4] underline">Return to the drop.</button></div> : <>
            <div className="mt-12 space-y-8">
              <div><p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#f7f3e9]/60">Contact details</p><div className="grid gap-3 sm:grid-cols-2"><input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" className="checkout-input" /><input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email address" type="email" className="checkout-input" /><input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone / WhatsApp" className="checkout-input sm:col-span-2" /></div></div>
              <div><div className="mb-4 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f7f3e9]/60">Shipping address</p><span className="flex items-center gap-1.5 text-[10px] text-[#f7f3e9]/50"><MapPin size={13} /> South Africa</span></div><div className="grid gap-3 sm:grid-cols-2"><input ref={addressRef} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Start typing your street address" className="checkout-input sm:col-span-2" /><input value={form.suburb} onChange={(e) => update("suburb", e.target.value)} placeholder="Suburb" className="checkout-input" /><input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className="checkout-input" /><select value={form.province} onChange={(e) => update("province", e.target.value)} className="checkout-input bg-[#11100f]"><option value="">Province</option>{PROVINCES.map((province) => <option key={province} value={province}>{province}</option>)}</select><input value={form.postal} onChange={(e) => update("postal", e.target.value)} placeholder="Postal code" className="checkout-input" /></div><div className="relative mt-4 h-56 overflow-hidden border border-[#f7f3e9]/20 bg-[#1a1917]">{!mapReady && <div className="absolute inset-0 z-10 grid place-items-center bg-[#1a1917] px-6 text-center text-xs text-[#f7f3e9]/55">Map enhancement loading. Manual address entry is always available.</div>}<MapView className="size-full" initialCenter={{ lat: -30.5595, lng: 22.9375 }} initialZoom={4.5} onMapReady={handleMap} /></div><p className="mt-2 text-[11px] text-[#f7f3e9]/45">Address autocomplete and map pin are optional enhancements. If unavailable, continue with manual entry.</p></div>
              <div><p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#f7f3e9]/60">Payment</p><div className="flex items-start gap-3 border border-[#f7f3e9]/20 p-4"><LockKeyhole size={18} className="mt-0.5 text-[#B5342E]" /><div><p className="text-sm font-bold">PayFast secure checkout</p><p className="mt-1 text-xs leading-relaxed text-[#f7f3e9]/55">Your payment will be processed securely by PayFast. This build is configured for sandbox testing until the merchant credentials are added.</p></div></div></div>
            </div>
            <button onClick={submitOrder} disabled={createOrder.isPending || preparePayfast.isPending || !form.name || !form.email || !form.phone || !form.address || !form.province || !form.postal} className="mt-10 w-full bg-[#B5342E] py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40">{createOrder.isPending || preparePayfast.isPending ? "Preparing secure payment…" : `Continue to PayFast — R${total}`}</button>{submitError && <p className="mt-3 text-center text-xs text-[#B5342E]">{submitError}</p>}
          </>}
        </section>
        <aside className="h-fit border-t border-[#f7f3e9]/20 pt-5 lg:sticky lg:top-8"><div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EFA8C4]">02 — Your haul</p><span className="text-xs text-[#f7f3e9]/50">{items.reduce((sum, item) => sum + item.quantity, 0)} pieces</span></div><div className="mt-6 space-y-5">{items.map((item) => { const p = getCartProduct(item.productSlug); if (!p) return null; return <div key={item.id} className="flex gap-4"><div className="size-20 shrink-0 bg-[#2a2422] p-2"><img src={p.image} alt="" className="size-full object-contain" /></div><div className="flex-1"><div className="flex justify-between gap-3"><p className="text-sm font-bold uppercase">{p.name}</p><p className="text-sm font-bold">R{getPrice(p.slug, item.size) * item.quantity}</p></div><p className="mt-1 text-xs text-[#f7f3e9]/50">{item.colorway} / {item.size}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center border border-[#f7f3e9]/20"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-white/5"><Minus size={12} /></button><span className="w-7 text-center text-xs">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-white/5"><Plus size={12} /></button></div><button onClick={() => removeItem(item.id)} aria-label="Remove item" className="text-[#B5342E] hover:text-white"><Trash2 size={15} /></button></div></div></div>; })}</div><div className="mt-8 space-y-3 border-t border-[#f7f3e9]/20 pt-5 text-sm"><div className="flex justify-between text-[#f7f3e9]/60"><span>Subtotal</span><span>R{subtotal}</span></div><div className="flex justify-between text-[#f7f3e9]/60"><span>Local shipping</span><span>R{shipping}</span></div><div className="flex justify-between pt-2 text-lg font-bold"><span>Total</span><span>R{total}</span></div></div></aside>
      </div>
    </main>
  );
}
