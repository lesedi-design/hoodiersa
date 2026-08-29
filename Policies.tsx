/* HoodieRSA Policies — plain-language starting copy with clear POPIA review notice. */
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, FileText, Ruler, ShieldCheck, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Policies() {
  const [location, navigate] = useLocation();
  const privacy = location === "/privacy";
  return (
    <main className="min-h-screen bg-[#11100f] text-[#f7f3e9]">
      <header className="flex items-center justify-between border-b border-[#f7f3e9]/20 px-4 py-5 sm:px-8"><button onClick={() => navigate("/")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] hover:opacity-60"><ArrowLeft size={16} /> HoodieRSA</button><p className="font-display text-xl">POLICY FILES</p><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f7f3e9]/60">The fine print</span></header>
      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-10 sm:py-20"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EFA8C4]">04 — {privacy ? "Privacy" : "Shipping / returns / terms"}</p><h1 className="mt-4 max-w-3xl font-display text-[clamp(56px,9vw,120px)] uppercase leading-[0.82] tracking-[-0.03em]">{privacy ? <>Your data.<br /><span className="text-[#B5342E]">Your say.</span></> : <>Good to<br /><span className="text-[#B5342E]">know.</span></>}</h1>
        <div className="mt-16 space-y-12 border-t border-[#f7f3e9]/20 pt-8">
          {privacy ? <>
            <PolicySection icon={<ShieldCheck />} title="What we collect">When you place an order, we collect your name, email address, phone number, shipping address, and order details. PayFast processes payment details securely; HoodieRSA does not store your card details.</PolicySection>
            <PolicySection title="Why we collect it">We use this information to fulfil your order, arrange delivery, send order updates, answer support requests, and resolve issues. We do not sell your personal information or share it beyond what is needed for the courier and PayFast to fulfil your order.</PolicySection>
            <PolicySection title="Your choices">You can request that we correct or delete your personal information, subject to records we must keep for legal or accounting reasons. Contact the store using the email or WhatsApp details provided at launch.</PolicySection>
            <div className="border border-[#B5342E]/60 bg-[#B5342E]/10 p-5 text-sm leading-relaxed text-[#f7f3e9]/80"><strong className="text-[#EFA8C4]">Review before launch:</strong> This is a plain-language starting template, not legal advice. Have the final notice reviewed by someone knowledgeable in South Africa’s POPIA requirements before collecting customer data.</div>
          </> : <>
            <PolicySection icon={<Truck />} title="Shipping">Orders are prepared in small batches and generally ship within 3–5 business days after payment is verified. A flat local shipping rate of R60 is shown at checkout. Delivery timing can vary by destination and courier availability.</PolicySection>
            <PolicySection title="Returns and exchanges">If your item arrives damaged or the wrong item was sent, contact us within 7 days with your order number and photos. Because pieces are embroidered in small runs, change-of-mind returns and size exchanges are subject to availability and must be agreed with us before sending anything back.</PolicySection>
            <PolicySection icon={<FileText />} title="Terms of service">Product imagery and descriptions are provided in good faith. Prices and availability may change before an order is confirmed. An order is accepted once payment is verified and HoodieRSA sends confirmation. Customers are responsible for checking size guidance before ordering.</PolicySection>
            <div className="border border-[#f7f3e9]/20 p-5 text-sm leading-relaxed text-[#f7f3e9]/65">These policies are a starting point for a small independent shop. Replace placeholder contact details and have the final terms reviewed before launch.</div>
          </>}
        </div>
        <div className="mt-16 flex flex-wrap gap-5 border-t border-[#f7f3e9]/20 pt-5 text-xs font-bold uppercase tracking-[0.12em]"><button onClick={() => navigate(privacy ? "/policies" : "/privacy")} className="text-[#EFA8C4] hover:underline">{privacy ? "Shipping & returns" : "Privacy policy"}</button><SizeGuideDialog /><button onClick={() => navigate("/")} className="hover:text-[#EFA8C4]">Back to the drop</button></div>
      </div>
    </main>
  );
}
function SizeGuideDialog() { const [open, setOpen] = useState(() => window.location.hash === "#size-guide"); return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger className="flex items-center gap-1.5 text-[#EFA8C4] hover:underline"><Ruler size={14} /> Size guide</DialogTrigger><DialogContent className="border-[#f7f3e9]/20 bg-[#171515] text-[#f7f3e9]"><DialogHeader><DialogTitle className="font-display text-3xl uppercase">Size Guide</DialogTitle></DialogHeader><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-[#f7f3e9]/20 text-[#f7f3e9]/55"><th className="pb-2">Size</th><th className="pb-2">UK</th><th className="pb-2">US</th><th className="pb-2">Chest</th><th className="pb-2">Length</th></tr></thead><tbody className="divide-y divide-[#f7f3e9]/10"><tr><td className="py-2 font-bold">XS</td><td>6–8</td><td>2–4</td><td>96cm</td><td>64cm</td></tr><tr><td className="py-2 font-bold">S</td><td>8–10</td><td>4–6</td><td>101cm</td><td>66cm</td></tr><tr><td className="py-2 font-bold">M</td><td>10–12</td><td>6–8</td><td>106cm</td><td>68cm</td></tr><tr><td className="py-2 font-bold">L</td><td>12–14</td><td>8–10</td><td>111cm</td><td>70cm</td></tr><tr><td className="py-2 font-bold">XL</td><td>14–16</td><td>10–12</td><td>116cm</td><td>72cm</td></tr><tr><td className="py-2 font-bold">XXL</td><td>16–18</td><td>12–14</td><td>121cm</td><td>74cm</td></tr></tbody></table></div><p className="mt-4 text-xs leading-relaxed text-[#f7f3e9]/60">All measurements are approximate. Unisex fit — if between sizes, we recommend sizing up. Chest measured flat, underarm to underarm, doubled.</p></DialogContent></Dialog>; }

function PolicySection({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) { return <section className="grid gap-4 sm:grid-cols-[150px_1fr] sm:gap-10"><h2 className="flex items-center gap-2 font-display text-2xl uppercase tracking-[-0.02em] text-[#EFA8C4]">{icon && <span className="text-[#B5342E]">{icon}</span>}{title}</h2><p className="text-base leading-relaxed text-[#f7f3e9]/75">{children}</p></section>; }
