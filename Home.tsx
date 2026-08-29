/*
 * HoodieRSA Home — Haunted Editorial campaign wall.
 * Product photography intentionally overlaps oversized poster typography; use ink surfaces,
 * Ritual Red stitching, asymmetrical folios, and plain-spoken ordering actions.
 */
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, Instagram, Menu, MessageCircle, MoveRight, ShoppingBag, Sparkles, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const MARK = "/manus-storage/hoodiersa-stitch-mark_f101d160.png";
const WHATSAPP_BASE = "https://api.whatsapp.com/send?text=";

type Product = {
  id: string;
  slug: string;
  name: string;
  descriptor: string;
  price: string;
  image: string;
  bg: string;
  panel: string;
  darkText: boolean;
  accent: string;
  colors: { label: string; value: string }[];
  orderName: string;
};

const PRODUCTS: Product[] = [
  {
    id: "01",
    slug: "jack-and-sally",
    name: "Moonlit Pairing",
    descriptor: "Two souls, one silver moon.",
    price: "From R450",
    image: "/manus-storage/hoodiersa-jack-sally-inspired_40a99708.png",
    bg: "#B5342E",
    panel: "#C94F49",
    darkText: false,
    accent: "#F4D9D1",
    colors: [{ label: "Ritual red", value: "#B5342E" }, { label: "Ink", value: "#171515" }, { label: "Bone", value: "#EFE9DA" }],
    orderName: "Moonlit Pairing crewneck",
  },
  {
    id: "02",
    slug: "oogie-boogie",
    name: "Burlap Moon",
    descriptor: "A crooked smile for moonless plans.",
    price: "From R320",
    image: "/manus-storage/hoodiersa-burlap-ghoul-v2_05a3664e.png",
    bg: "#EFA8C4",
    panel: "#F2BBD1",
    darkText: true,
    accent: "#4E2839",
    colors: [{ label: "Candy pink", value: "#EFA8C4" }, { label: "Moss", value: "#8B997D" }, { label: "Oat", value: "#D6C29A" }],
    orderName: "Burlap Moon crewneck",
  },
  {
    id: "03",
    slug: "checkered-character",
    name: "Patchwork Cat",
    descriptor: "Nine lives. One clean stitch.",
    price: "From R250",
    image: "/manus-storage/hoodiersa-checkered-cat-v2_01b249dc.png",
    bg: "#939393",
    panel: "#B0B0B0",
    darkText: true,
    accent: "#302329",
    colors: [{ label: "Cemetery", value: "#939393" }, { label: "Night", value: "#171515" }, { label: "Check", value: "#F1EEDF" }],
    orderName: "Patchwork Cat crewneck",
  },
  {
    id: "04",
    slug: "corpse-bride",
    name: "Veil at Midnight",
    descriptor: "Something borrowed. Something blue.",
    price: "From R380",
    image: "/manus-storage/hoodiersa-gothic-bride-v2_68496a7e.png",
    bg: "#DCDCDC",
    panel: "#EAEAEA",
    darkText: true,
    accent: "#2C4960",
    colors: [{ label: "Ghost", value: "#ECEBE5" }, { label: "Mist", value: "#B5D0D9" }, { label: "Ink", value: "#171515" }],
    orderName: "Veil at Midnight crewneck",
  },
];

function orderLink(product?: string) {
  const message = product
    ? `Hi HoodieRSA, I want to claim the ${product}. Can you share available sizes and turnaround time?`
    : "Hi HoodieRSA, I want to claim a spooky embroidered piece. Can you share the current drop and available sizes?";
  return `${WHATSAPP_BASE}${encodeURIComponent(message)}`;
}

function BrandSignature({ inverse = false }: { inverse?: boolean }) {
  const main = inverse ? "#F7F3E9" : "#1a1616";
  return (
    <span className="flex items-center gap-2.5" aria-label="HoodieRSA">
      <span className="relative grid size-10 place-items-center border border-current/40" style={{ color: inverse ? "#F7F3E9" : "#B5342E" }}>
        <img src={MARK} alt="" className="size-8 object-contain" />
      </span>
      <span className="font-display text-[22px] leading-none tracking-[-0.045em]" style={{ color: main }}>
        HOODIE<span style={{ color: "#B5342E" }}>/</span>RSA
      </span>
    </span>
  );
}

function HeroImage({ product, role, isMobile }: { product: Product; role: "center" | "left" | "right" | "back"; isMobile: boolean }) {
  const styles: Record<typeof role, CSSProperties> = {
    center: {
      left: "50%", height: isMobile ? "60%" : "92%", bottom: isMobile ? "22%" : 0,
      transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`, filter: "blur(0px)", opacity: 1, zIndex: 20,
    },
    left: {
      left: isMobile ? "20%" : "30%", height: isMobile ? "16%" : "28%", bottom: isMobile ? "32%" : "12%",
      transform: "translateX(-50%) scale(1)", filter: "blur(2px)", opacity: 0.85, zIndex: 10,
    },
    right: {
      left: isMobile ? "80%" : "70%", height: isMobile ? "16%" : "28%", bottom: isMobile ? "32%" : "12%",
      transform: "translateX(-50%) scale(1)", filter: "blur(2px)", opacity: 0.85, zIndex: 10,
    },
    back: {
      left: "50%", height: isMobile ? "13%" : "22%", bottom: isMobile ? "32%" : "12%",
      transform: "translateX(-50%) scale(1)", filter: "blur(4px)", opacity: 1, zIndex: 5,
    },
  };

  return (
    <div
      aria-hidden={role !== "center"}
      className="absolute w-auto"
      style={{
        aspectRatio: "0.6 / 1",
        transition: "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)",
        willChange: "transform, filter, opacity",
        ...styles[role],
      }}
    >
      <img src={product.image} alt="" draggable={false} className="size-full object-contain object-bottom" />
    </div>
  );
}

function Hero() {
  const { itemCount } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = PRODUCTS[activeIndex];

  useEffect(() => {
    PRODUCTS.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const roles = useMemo(() => ({
    center: activeIndex,
    left: (activeIndex + 3) % PRODUCTS.length,
    right: (activeIndex + 1) % PRODUCTS.length,
    back: (activeIndex + 2) % PRODUCTS.length,
  }), [activeIndex]);

  const navigate = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((index) => direction === "next" ? (index + 1) % PRODUCTS.length : (index + PRODUCTS.length - 1) % PRODUCTS.length);
    window.setTimeout(() => setIsAnimating(false), 650);
  };

  const scrollToShop = () => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: active.bg, transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)" }}>
      <div className="relative h-[100svh] min-h-[650px] w-full overflow-hidden">
        <div className="grain pointer-events-none absolute inset-0 z-50 opacity-40" />
        <p className="pointer-events-none absolute inset-x-0 top-[18%] z-[2] select-none whitespace-nowrap text-center font-display text-[clamp(90px,28vw,380px)] leading-none tracking-[-0.02em] text-white">SPOOKY SEASON</p>

        <header className="absolute left-4 right-4 top-5 z-[60] flex items-center justify-between sm:left-8 sm:right-8 sm:top-6">
          <a href="#top" className="text-white" aria-label="HoodieRSA home">
            <BrandSignature inverse />
          </a>
          <div className="hidden items-center gap-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 sm:flex">
            <a href="/checkout" className="relative flex items-center gap-1.5 transition-opacity hover:opacity-60"><ShoppingBag size={15} /> Cart {itemCount > 0 && <span className="grid size-4 place-items-center rounded-full bg-[#B5342E] text-[9px] text-white">{itemCount}</span>}</a>
            <a href="#shop" className="transition-opacity hover:opacity-60">The drop</a>
            <a href="#craft" className="transition-opacity hover:opacity-60">Our thread</a>
            <a href="https://www.instagram.com/hoodiersa/" target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60">Instagram</a>
          </div>
          <button onClick={() => setMenuOpen((open) => !open)} className="grid size-10 place-items-center border border-white/40 text-white transition-colors hover:bg-white/10 sm:hidden" aria-expanded={menuOpen} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {menuOpen && (
          <nav className="absolute right-4 top-17 z-[70] flex w-52 flex-col border border-white/20 bg-[#151313]/95 p-2 text-sm font-semibold text-white shadow-2xl backdrop-blur" aria-label="Mobile navigation">
            <a onClick={() => setMenuOpen(false)} href="#shop" className="px-4 py-3 hover:bg-white/10">The drop</a>
            <a onClick={() => setMenuOpen(false)} href="#craft" className="px-4 py-3 hover:bg-white/10">Our thread</a>
            <a href="https://www.instagram.com/hoodiersa/" target="_blank" rel="noreferrer" className="px-4 py-3 hover:bg-white/10">Instagram</a>
          </nav>
        )}

        <div className="absolute inset-0 z-[3]">
          {PRODUCTS.map((product, index) => {
            const role = index === roles.center ? "center" : index === roles.left ? "left" : index === roles.right ? "right" : "back";
            return <HeroImage key={product.id} product={product} role={role} isMobile={isMobile} />;
          })}
        </div>

        <div className="absolute bottom-6 left-4 z-[60] max-w-[320px] sm:bottom-20 sm:left-24">
          <p className="mb-2 text-base font-bold uppercase tracking-[0.02em] text-white sm:mb-3 sm:text-[22px]">Embroidered crewnecks</p>
          <p className="mb-4 hidden text-xs leading-relaxed text-white/85 sm:mb-5 sm:block sm:text-sm">Hand-finished embroidery, shipped ready to wear. Limited Halloween run — order now before the thread runs out.</p>
          <div className="flex gap-2.5">
            <button onClick={() => navigate("prev")} className="grid size-12 place-items-center rounded-full border-2 border-white text-white transition duration-150 hover:scale-[1.08] hover:bg-white/12 active:scale-95 sm:size-16" aria-label="Previous collection"><ArrowLeft size={26} strokeWidth={2.25} /></button>
            <button onClick={() => navigate("next")} className="grid size-12 place-items-center rounded-full border-2 border-white text-white transition duration-150 hover:scale-[1.08] hover:bg-white/12 active:scale-95 sm:size-16" aria-label="Next collection"><ArrowRight size={26} strokeWidth={2.25} /></button>
          </div>
        </div>

        <button onClick={scrollToShop} className="group absolute bottom-7 right-4 z-[60] flex items-center gap-2 font-display text-[clamp(20px,4vw,56px)] leading-none tracking-[-0.02em] text-white/95 transition-opacity hover:text-white sm:bottom-20 sm:right-10" aria-label="Shop now">
          Shop now <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1 sm:size-8" strokeWidth={2.25} />
        </button>

        <div className="absolute bottom-0 left-0 z-[55] hidden w-full border-t border-white/25 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 sm:flex sm:justify-between">
          <span>Collection {active.id} / 04</span>
          <span>{active.name}</span>
          <span>Made for the permanently October</span>
        </div>
      </div>
    </section>
  );
}

function ProductSlide({ product, detail }: { product: Product; detail?: boolean }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: product.panel }}>
      <div className="grain pointer-events-none absolute inset-0 z-10 opacity-25" />
      {detail && <div className="absolute left-4 top-4 z-20 border border-black/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: product.darkText ? "#1a1616" : "#fff" }}>Stitch detail</div>}
      <img src={product.image} alt={`${product.name} embroidered crewneck${detail ? " embroidery detail" : ""}`} className={detail ? "absolute left-1/2 top-[13%] h-[130%] w-[130%] max-w-none -translate-x-1/2 object-contain object-top" : "absolute inset-0 size-full object-contain p-3"} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <article className={`group relative ${index % 2 ? "lg:mt-28" : ""}`}>
      <div className="relative mx-auto max-w-[520px]">
        <div className="halftone pointer-events-none absolute -right-4 top-8 z-20 hidden size-20 rotate-12 text-white/30 md:block" />
        <div className="pointer-events-none absolute -left-9 top-1/2 z-20 hidden -translate-y-1/2 -rotate-90 text-[9px] font-bold uppercase tracking-[0.24em] text-[#f7f3e9]/60 lg:block">HoodieRSA / drop {product.id}</div>
        <Carousel opts={{ loop: true }} className="overflow-visible">
          <CarouselContent className="-ml-0">
            <CarouselItem className="pl-0"><ProductSlide product={product} /></CarouselItem>
            <CarouselItem className="pl-0"><ProductSlide product={product} detail /></CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="bottom-4 left-4 top-auto z-30 size-9 border-black/25 bg-white/60 text-black hover:bg-white disabled:opacity-30" />
          <CarouselNext className="bottom-4 right-4 top-auto z-30 size-9 border-black/25 bg-white/60 text-black hover:bg-white disabled:opacity-30" />
        </Carousel>
        <div className="absolute -left-3 -top-3 z-30 grid size-12 place-items-center font-display text-2xl leading-none" style={{ background: product.darkText ? "#1a1616" : "#F7F3E9", color: product.darkText ? "#F7F3E9" : "#1a1616" }}>{product.id}</div>
      </div>

      <div className="relative z-40 mx-auto -mt-8 ml-5 flex max-w-[calc(520px-20px)] items-start justify-between gap-5 border-l-2 border-[#B5342E] bg-[#11100f] px-4 pb-5 pt-4 shadow-[-10px_10px_0_rgba(181,52,46,0.16)]">
        <span className="stitch-line absolute left-0 top-0 h-px w-full text-[#f7f3e9]/35" />
        <div>
          <h3 className="font-display text-3xl uppercase leading-[0.94] tracking-[-0.025em] text-[#f7f3e9] sm:text-4xl">{product.name}</h3>
          <p className="mt-2 text-sm text-[#f7f3e9]/65">{product.descriptor}</p>
          <div className="mt-4 flex items-center gap-2" aria-label="Available colorways">
            {product.colors.map((color) => <span key={color.label} title={color.label} className="size-4 rounded-full border border-white/35" style={{ backgroundColor: color.value }} />)}
            <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f7f3e9]/60">{product.colors.length} colorways</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-[#f7f3e9]">{product.price}</p>
          <a href={`/product/${product.slug}`} className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f7f3e9] transition-colors hover:text-[#EFA8C4]">View details <ArrowDownRight size={15} /></a>
        </div>
      </div>
    </article>
  );
}

function Shop() {
  return (
    <section id="shop" className="relative bg-[#11100f] px-4 pb-24 pt-20 sm:px-8 sm:pb-36 sm:pt-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="stitch-line pointer-events-none absolute -top-6 left-0 h-px w-[min(460px,65%)] text-[#B5342E]" />
        <div className="mb-8 grid grid-cols-2 gap-3 border-y border-[#f7f3e9]/15 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f7f3e9]/60 sm:grid-cols-4"><span>Secure checkout</span><span>Hand-embroidered SA</span><span>Fast local shipping</span><span>PayFast-ready sandbox</span></div>
+        <div className="mb-14 grid gap-6 border-t border-[#f7f3e9]/25 pt-5 sm:grid-cols-[0.8fr_1.2fr] sm:items-end sm:pt-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EFA8C4]">01 — Current drop</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#f7f3e9]/65">Four embroidered reasons to keep the strange part of the season close.</p>
          </div>
          <h2 className="max-w-2xl font-display text-[clamp(58px,10vw,160px)] uppercase leading-[0.8] tracking-[-0.035em] text-[#f7f3e9]">Pick your<br /><span className="text-[#B5342E]">haunting.</span></h2>
        </div>
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 md:gap-y-20">
          {PRODUCTS.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
        </div>
      </div>
    </section>
  );
}

function Craft() {
  return (
    <section id="craft" className="relative overflow-hidden bg-[#201614] px-4 py-22 text-[#f7f3e9] sm:px-8 sm:py-32">
      <div className="grain pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div className="relative aspect-square max-w-[420px] overflow-hidden border border-[#f7f3e9]/20 bg-[#B5342E] p-6">
          <div className="absolute inset-5 border border-dashed border-white/45" />
          <img src={MARK} alt="" className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 object-contain" />
          <p className="absolute bottom-6 left-6 max-w-[190px] text-[10px] font-bold uppercase leading-relaxed tracking-[0.15em] text-white/80">Drawn to be worn. Threaded to be kept.</p>
        </div>
        <div className="lg:pb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EFA8C4]">02 — The work behind the weird</p>
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(55px,8vw,124px)] uppercase leading-[0.84] tracking-[-0.03em]">Not printed.<br />Properly <span className="text-[#B5342E]">stitched.</span></h2>
          <div className="mt-9 grid max-w-2xl gap-7 border-t border-[#f7f3e9]/20 pt-6 sm:grid-cols-2">
            <p className="text-base leading-relaxed text-[#f7f3e9]/80">Every motif begins as a small illustration, then takes shape through dense, tactile embroidery. The result has more texture than a graphic print—and gets better with repeat wears.</p>
            <div className="space-y-4 text-sm text-[#f7f3e9]/70">
              <p><span className="mr-3 font-display text-2xl text-[#EFA8C4]">01</span>Original spooky artwork</p>
              <p><span className="mr-3 font-display text-2xl text-[#EFA8C4]">02</span>Made in small runs</p>
              <p><span className="mr-3 font-display text-2xl text-[#EFA8C4]">03</span>Ready for permanent October</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderSection() {
  return (
    <section id="order" className="relative overflow-hidden bg-[#11100f] px-4 py-4 text-[#1b1517] sm:px-8 sm:py-7">
      <div className="absolute inset-4 border border-[#B5342E]/50 bg-[#EFA8C4] sm:inset-7" />
      <div className="grain pointer-events-none absolute inset-4 opacity-30 sm:inset-7" />
      <div className="stitch-line pointer-events-none absolute left-9 top-10 z-10 h-px w-[calc(100%-72px)] text-[#B5342E] sm:left-15 sm:top-13 sm:w-[calc(100%-120px)]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-9 px-5 py-16 sm:px-12 sm:py-22 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]">03 — No cart. No guesswork.</p>
          <h2 className="mt-5 font-display text-[clamp(58px,9.5vw,150px)] uppercase leading-[0.8] tracking-[-0.035em]">Send a DM.<br />Claim the <span className="text-[#B5342E]">weird.</span></h2>
        </div>
        <div className="max-w-md lg:justify-self-end">
          <p className="text-base leading-relaxed text-[#3c222d]/85">Ordering is personal here. Tap through with the piece you want, tell us your size, and we’ll confirm the available colors and turnaround time.</p>
          <p className="mt-4 border-l-2 border-[#B5342E] pl-4 text-xs font-bold uppercase tracking-[0.1em] text-[#3c222d]/70">Client notes will appear here after verified orders. No made-up reviews — ever.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={orderLink()} target="_blank" rel="noreferrer" aria-label="Order on WhatsApp" title="Order on WhatsApp" className="inline-flex items-center gap-3 bg-[#B5342E] px-5 py-4 text-sm font-bold text-white transition-transform duration-150 hover:-translate-y-1 active:scale-[0.97]"><MessageCircle size={18} /><MoveRight size={18} /></a>
            <a href="https://www.instagram.com/hoodiersa/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border border-[#1b1517]/40 px-5 py-4 text-sm font-bold transition-colors hover:bg-[#1b1517] hover:text-white"><Instagram size={18} /> DM on Instagram</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#11100f] px-4 pb-7 pt-16 text-[#f7f3e9] sm:px-8 sm:pt-20">
      <div className="grain pointer-events-none absolute inset-0 opacity-20" />
      <div className="stitch-line pointer-events-none absolute left-0 top-7 h-px w-1/2 text-[#B5342E]" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-10 border-b border-[#f7f3e9]/20 pb-12 sm:flex-row sm:items-end">
          <div>
            <BrandSignature inverse />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#f7f3e9]/60">Embroidered moods for the people who never really packed Halloween away.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-14 gap-y-3 text-sm">
            <a href="#shop" className="hover:text-[#EFA8C4]">The drop</a>
            <a href="#craft" className="hover:text-[#EFA8C4]">Our thread</a>
            <a href="https://www.instagram.com/hoodiersa/" target="_blank" rel="noreferrer" className="hover:text-[#EFA8C4]">@hoodiersa</a>
            <a href="/policies" className="hover:text-[#EFA8C4]">Shipping / Returns</a>
            <a href="/privacy" className="hover:text-[#EFA8C4]">Privacy / POPIA</a>
            <a href="/policies#size-guide" className="hover:text-[#EFA8C4]">Size Guide</a>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 py-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f7f3e9]/45 sm:flex-row"><span>© {new Date().getFullYear()} HoodieRSA</span><span>Wear the weird stuff.</span></div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main id="top" className="overflow-hidden bg-[#11100f]">
      <Hero />
      <div className="overflow-hidden border-y border-[#f7f3e9]/20 bg-[#171515] py-3 text-[#f7f3e9]">
        <div className="ticker-track flex items-center gap-7 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em]" aria-hidden="true">
          {[...Array(2)].flatMap(() => ["Hand embroidered", "Limited Halloween run", "Made for permanent October", "Spooky stitched goods"]).map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-7">{item}<Sparkles className="size-3 text-[#B5342E]" /></span>)}
        </div>
      </div>
      <Shop />
      <Craft />
      <OrderSection />
      <Footer />
      <a href={orderLink()} target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 bg-[#B5342E] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-150 hover:-translate-y-1 active:scale-[0.97] sm:bottom-7 sm:right-7" aria-label="Order via WhatsApp"><MessageCircle size={18} /> <span className="hidden sm:inline">Order by WhatsApp</span></a>
    </main>
  );
}
