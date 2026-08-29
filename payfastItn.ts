/* HoodieRSA PayFast ITN endpoint — return_url never changes payment state. */
import type { Express, Request, Response } from "express";
import { markOrderPaidFromItn } from "./db";
import { getPayFastConfig, isPayFastSourceIp, isValidPayFastItnPayload, validatePayFastItn } from "./payfast";

export function registerPayFastItn(app: Express) {
  app.post("/api/payfast/itn", async (req: Request, res: Response) => {
    try {
      const fields = Object.fromEntries(Object.entries(req.body || {}).map(([key, value]) => [key, String(value ?? "")]));
      const config = getPayFastConfig();
      const log = (event: string, extra: Record<string, unknown> = {}) => console.info(JSON.stringify({ scope: "payfast_itn", event, mode: config.mode, ...extra }));
      const cloudflareIp = String(req.headers["cf-connecting-ip"] || "").trim();
      const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
      log("received", { sourceIp: cloudflareIp || forwardedFor || req.socket.remoteAddress || req.ip, orderNumber: fields.m_payment_id || null, paymentStatus: fields.payment_status || null, amount: fields.amount_gross || fields.amount || null });
      const sourceIp = cloudflareIp || forwardedFor || req.socket.remoteAddress || req.ip;
      if (!(await isPayFastSourceIp(sourceIp))) { log("rejected_source", { sourceIp, responseStatus: 403 }); return res.status(403).send("INVALID_SOURCE"); }
      const expectedMerchant = config.merchantId;
      const amount = fields.amount_gross || fields.amount;
      if (!isValidPayFastItnPayload(fields, expectedMerchant)) { log("rejected_payload", { orderNumber: fields.m_payment_id || null, responseStatus: 400 }); return res.status(400).send("INVALID"); }
      const verified = await validatePayFastItn(fields);
      if (!verified) { log("rejected_verification", { orderNumber: fields.m_payment_id, responseStatus: 400 }); return res.status(400).send("INVALID"); }
      log("verified", { orderNumber: fields.m_payment_id, amount });
      const paid = await markOrderPaidFromItn(fields.m_payment_id, amount);
      if (!paid) { log("unmatched_order", { orderNumber: fields.m_payment_id, amount, responseStatus: 409 }); return res.status(409).send("UNMATCHED"); }
      log("paid", { orderNumber: fields.m_payment_id, amount, responseStatus: 200 });
      return res.status(200).send("OK");
    } catch (error) {
      console.error(JSON.stringify({ scope: "payfast_itn", event: "error", message: error instanceof Error ? error.message : "unknown error" }));
      console.info(JSON.stringify({ scope: "payfast_itn", event: "response", responseStatus: 500 }));
      return res.status(500).send("ERROR");
    }
  });
}
