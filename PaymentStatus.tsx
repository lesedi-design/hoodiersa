/* HoodieRSA Payment Status — honest PayFast handoff states until merchant credentials and ITN callbacks are enabled. */
import { CheckCircle2, CircleX, RotateCcw, ShieldAlert } from "lucide-react";
import { useLocation, useRoute } from "wouter";

const STATES = {
  success: { eyebrow: "Payment received", title: "The thread is pending.", body: "You returned from PayFast successfully. We will mark this order paid only after the server verifies PayFast’s ITN notification, then prepare your piece.", icon: CheckCircle2, color: "#92B58A", action: "Back to the drop" },
  cancel: { eyebrow: "Payment cancelled", title: "No haunting today.", body: "The payment window was closed before completion. Your cart is still waiting if you want to try again.", icon: RotateCcw, color: "#EFA8C4", action: "Return to checkout" },
  failed: { eyebrow: "Payment needs a retry", title: "The signal broke.", body: "PayFast did not confirm this payment. No order is treated as paid until the server receives a verified callback.", icon: ShieldAlert, color: "#B5342E", action: "Try checkout again" },
} as const;

export default function PaymentStatus() {
  const [, params] = useRoute("/checkout/:status");
  const [, navigate] = useLocation();
  const status = (params?.status === "success" || params?.status === "cancel" || params?.status === "failed") ? params.status : "failed";
  const view = STATES[status];
  const Icon = view.icon;
  return <main className="grid min-h-screen place-items-center bg-[#11100f] px-5 text-[#f7f3e9]"><div className="max-w-lg text-center"><div className="mx-auto grid size-20 place-items-center rounded-full" style={{ backgroundColor: view.color, color: "#11100f" }}><Icon size={38} /></div><p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: view.color }}>{view.eyebrow}</p><h1 className="mt-3 font-display text-[clamp(56px,9vw,100px)] uppercase leading-[0.82] tracking-[-0.03em]">{view.title}</h1><p className="mt-7 text-base leading-relaxed text-[#f7f3e9]/65">{view.body}</p><button onClick={() => navigate(status === "success" ? "/" : status === "cancel" ? "/checkout" : "/checkout")} className="mt-9 border border-[#f7f3e9]/30 px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] transition hover:bg-white/10">{view.action}</button><p className="mt-8 text-[10px] uppercase tracking-[0.14em] text-[#f7f3e9]/35">PayFast sandbox / production credentials required before launch</p></div></main>;
}
