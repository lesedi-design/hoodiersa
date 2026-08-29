/* HoodieRSA Product Page — Haunted Editorial campaign details. */
import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Minus, Plus, Ruler, ShieldCheck, Truck, Sparkles, ShoppingBag, X } from "lucide-react";
import { getCartProduct, useCart, type Size } from "@/contexts/CartContext";
import { SIZE_ORDER, getPrice } from "@shared/catalog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";

export default function ProductPage() {
  const [, params] = useRoute("/product/:slug");
  const [, navigate] = useLocation();
  const product = getCartProduct(params?.slug || "");
  const { addItem, items, subtotal, updateQuantity, removeItem } = useCart();
  const [colorway, setColorway] = useState(product?.colors[0]?.label || "");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);

  if (!product) return <div className="p-20 text-center text-white">Product not found.</div>;

  const price = size ? getPrice(product.slug, size) : product.basePrice;
  const gallerySets = Object.fromEntries(product.colors.map((color) => [color.label, [product.image, product.image]])) as Record<string, string[]>;
  const gallery = gallerySets[colorway] || gallerySets[product.colors[0]?.label] || [product.image];
  const handleAdd = () => { if (size) { addItem({ productSlug: product.slug, colorway, size, quantity }); setCartOpen(true); } };

  return (
    <main className="min-h-screen bg-[#11100f] text-[#f7f3e9]">
      <header className="flex items-center justify-between border-b border-[#f7f3e9]/20 px-4 py-5 sm:px-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"><ArrowLeft size={16} /> Back to drop</button>
        <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-60"><ShoppingBag size={16} /> Cart {items.length > 0 && <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-[#B5342E] text-[9px]">{items.length}</span>}</button>
      </header>

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-[calc(100vh-65px)]" style={{ backgroundColor: product.panel }}>
          <div className="grain pointer-events-none absolute inset-0 z-10 opacity-25" />
          <img src={gallery[galleryIndex]} alt={`${product.name} ${galleryIndex === 0 ? "front view" : "embroidery detail"}`} className={`absolute inset-0 size-full object-contain p-4 transition-transform duration-300 lg:p-12 ${galleryIndex === 1 ? "scale-125" : ""}`} />
          <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 lg:bottom-8 lg:left-8">{gallery.map((image, index) => <button key={`${image}-${index}`} onClick={() => setGalleryIndex(index)} className={`h-16 w-16 overflow-hidden border bg-[#11100f]/30 p-1 transition ${galleryIndex === index ? "border-white" : "border-white/30"}`} aria-label={`View ${index === 0 ? "front" : "embroidery detail"}`}><img src={image} alt="" className="size-full object-contain" /></button>)}</div>
        </div>

        <div className="px-5 py-12 sm:px-12 lg:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B5342E]">Collection {product.id} / 04</p>
          <h1 className="mt-4 font-display text-[clamp(48px,8vw,96px)] uppercase leading-[0.85] tracking-[-0.03em]">{product.name}</h1>
          <p className="mt-4 text-lg text-[#f7f3e9]/70">{product.descriptor}</p>
          <p className="mt-8 text-2xl font-bold">R{price}</p>

          <div className="mt-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f7f3e9]/60">Colorway: <span className="text-[#f7f3e9]">{colorway}</span></p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c) => (
                <button key={c.label} onClick={() => { setColorway(c.label); setGalleryIndex(0); }} className={`size-8 rounded-full border-2 transition-transform ${colorway === c.label ? "scale-110 border-white" : "border-transparent hover:scale-105"}`} style={{ backgroundColor: c.value }} aria-label={c.label} />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f7f3e9]/60">Size</p>
              <Dialog>
                <DialogTrigger className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#f7f3e9]/60 transition-colors hover:text-white"><Ruler size={14} /> Size Guide</DialogTrigger>
                <DialogContent className="border-[#f7f3e9]/20 bg-[#171515] text-[#f7f3e9] sm:max-w-md">
                  <DialogHeader><DialogTitle className="font-display text-3xl uppercase tracking-[-0.02em]">Size Guide</DialogTitle></DialogHeader>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead><tr className="border-b border-[#f7f3e9]/20 text-[#f7f3e9]/60"><th className="pb-2 font-normal">Size</th><th className="pb-2 font-normal">UK</th><th className="pb-2 font-normal">US</th><th className="pb-2 font-normal">Chest</th><th className="pb-2 font-normal">Length</th></tr></thead>
                      <tbody className="divide-y divide-[#f7f3e9]/10">
                        <tr><td className="py-3 font-bold">XS</td><td className="py-3">6–8</td><td className="py-3">2–4</td><td className="py-3">96cm</td><td className="py-3">64cm</td></tr>
                        <tr><td className="py-3 font-bold">S</td><td className="py-3">8–10</td><td className="py-3">4–6</td><td className="py-3">101cm</td><td className="py-3">66cm</td></tr>
                        <tr><td className="py-3 font-bold">M</td><td className="py-3">10–12</td><td className="py-3">6–8</td><td className="py-3">106cm</td><td className="py-3">68cm</td></tr>
                        <tr><td className="py-3 font-bold">L</td><td className="py-3">12–14</td><td className="py-3">8–10</td><td className="py-3">111cm</td><td className="py-3">70cm</td></tr>
                        <tr><td className="py-3 font-bold">XL</td><td className="py-3">14–16</td><td className="py-3">10–12</td><td className="py-3">116cm</td><td className="py-3">72cm</td></tr>
                        <tr><td className="py-3 font-bold">XXL</td><td className="py-3">16–18</td><td className="py-3">12–14</td><td className="py-3">121cm</td><td className="py-3">74cm</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-xs text-[#f7f3e9]/60">All measurements are approximate. Unisex fit — if between sizes, we recommend sizing up. Chest measured flat, underarm to underarm, doubled.</p>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {SIZE_ORDER.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`border py-3 text-sm font-bold transition-colors ${size === s ? "border-[#B5342E] bg-[#B5342E] text-white" : "border-[#f7f3e9]/20 hover:border-[#f7f3e9]/60"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <div className="flex items-center border border-[#f7f3e9]/20">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-4 transition-colors hover:bg-white/5"><Minus size={16} /></button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-4 transition-colors hover:bg-white/5"><Plus size={16} /></button>
            </div>
            <button onClick={handleAdd} disabled={!size} className="flex-1 bg-[#f7f3e9] py-4 text-sm font-bold uppercase tracking-[0.1em] text-[#11100f] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50">
              {size ? "Add to Cart" : "Select a Size"}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#f7f3e9]/20 pt-6 text-[11px] font-bold uppercase tracking-[0.1em] text-[#f7f3e9]/70">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#B5342E]" /> Secure PayFast Checkout</span>
            <span className="flex items-center gap-2"><Truck size={16} className="text-[#B5342E]" /> Ships within 3-5 days</span>
            <span className="flex items-center gap-2"><Sparkles size={16} className="text-[#B5342E]" /> Hand-embroidered</span>
          </div>

          <div className="mt-16 space-y-6 text-sm leading-relaxed text-[#f7f3e9]/80">
            <p><strong>The Craft:</strong> Every motif begins as a small illustration, then takes shape through dense, tactile embroidery. The result has more texture than a graphic print—and gets better with repeat wears.</p>
            <p><strong>The Fabric:</strong> Premium heavyweight fleece. 80% cotton, 20% polyester blend for structure and warmth without stiffness.</p>
            <p><strong>Care:</strong> Wash cold, inside out. Do not iron directly over the embroidery. Hang dry to preserve the thread tension.</p>
          </div>
        </div>
      </div>

      <Drawer open={cartOpen} onOpenChange={setCartOpen} direction="right">
        <DrawerContent className="fixed bottom-0 right-0 top-0 mt-0 flex w-full flex-col rounded-none border-l border-[#f7f3e9]/20 bg-[#171515] text-[#f7f3e9] sm:max-w-md" data-vaul-drawer-direction="right">
          <DrawerHeader className="border-b border-[#f7f3e9]/20 text-left">
            <DrawerTitle className="font-display text-3xl uppercase tracking-[-0.02em]">Your Haul</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4 opacity-70 hover:opacity-100"><X size={24} /></DrawerClose>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <p className="mt-10 text-center text-sm text-[#f7f3e9]/60">Your cart is empty. Go claim something weird.</p>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  const p = getCartProduct(item.productSlug);
                  if (!p) return null;
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="size-20 shrink-0 bg-[#11100f] p-2"><img src={p.image} alt="" className="size-full object-contain" /></div>
                      <div className="flex-1">
                        <div className="flex justify-between"><p className="font-bold uppercase">{p.name}</p><p className="font-bold">R{getPrice(p.slug, item.size) * item.quantity}</p></div>
                        <p className="text-xs text-[#f7f3e9]/60">{item.colorway} / Size {item.size}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-[#f7f3e9]/20">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-white/5"><Minus size={12} /></button>
                            <span className="w-6 text-center text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-white/5"><Plus size={12} /></button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#B5342E] hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {items.length > 0 && (
            <div className="border-t border-[#f7f3e9]/20 p-4 sm:p-6">
              <div className="mb-4 flex justify-between font-bold uppercase"><p>Subtotal</p><p>R{subtotal}</p></div>
              <p className="mb-6 text-xs text-[#f7f3e9]/60">Shipping calculated at checkout.</p>
              <button onClick={() => { setCartOpen(false); navigate("/checkout"); }} className="w-full bg-[#B5342E] py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]">Proceed to Checkout</button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </main>
  );
}
