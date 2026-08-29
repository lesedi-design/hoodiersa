/* HoodieRSA Cookie Banner — transparent consent copy for order-related personal data and analytics. */
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(localStorage.getItem("hoodiersa-cookie-choice") === null); }, []);
  const choose = (value: "accepted" | "declined") => { localStorage.setItem("hoodiersa-cookie-choice", value); setVisible(false); };
  if (!visible) return null;
  return <aside className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[#f7f3e9]/20 bg-[#171515]/95 px-4 py-4 text-[#f7f3e9] shadow-2xl backdrop-blur-md sm:px-8"><div className="mx-auto flex max-w-[1440px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><Cookie className="mt-0.5 shrink-0 text-[#EFA8C4]" size={20} /><p className="max-w-3xl text-xs leading-relaxed text-[#f7f3e9]/75">We use cookies to improve your browsing experience and process your order. We collect your email and phone number when you order to send updates and confirmations. <a href="/privacy" className="text-[#EFA8C4] underline">Read the privacy note.</a></p></div><div className="flex shrink-0 gap-2"><button onClick={() => choose("declined")} className="border border-[#f7f3e9]/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-white/10">Decline non-essential</button><button onClick={() => choose("accepted")} className="bg-[#B5342E] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[#c8463f]">Accept</button><button onClick={() => choose("declined")} aria-label="Close cookie banner" className="px-2 text-[#f7f3e9]/60 hover:text-white"><X size={16} /></button></div></div></aside>;
}
