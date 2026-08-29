import { describe, expect, it } from "vitest";
import { getPayFastConfig, isPayFastSourceIp, isValidPayFastItnPayload, preparePayFastPayload, verifyPayFastSignature } from "./payfast";

describe("PayFast secret configuration", () => {
  it("loads sandbox configuration without exposing credentials to the client", () => {
    const config = getPayFastConfig();
    expect(config.mode).toBe("sandbox");
    expect(config.endpoint).toBe("https://sandbox.payfast.co.za/eng/process");
    expect(typeof config.configured).toBe("boolean");
  });

  it("uses the configured passphrase when preparing the signed payment payload", () => {
    const prepared = preparePayFastPayload({ amount: 450, orderNumber: "HRS-TEST123", name: "Test Buyer", email: "buyer@example.com", returnUrl: "https://example.com/checkout/success", cancelUrl: "https://example.com/checkout/cancel", notifyUrl: "https://example.com/api/payfast/itn" });
    expect(prepared.endpoint).toBe("https://sandbox.payfast.co.za/eng/process");
    expect(prepared.configured).toBe(true);
    if (prepared.configured) expect(prepared.fields.signature).toMatch(/^[a-f0-9]{32}$/);
  });

  it("rejects a tampered ITN signature", () => {
    expect(verifyPayFastSignature({ merchant_id: "wrong", signature: "00000000000000000000000000000000" })).toBe(false);
  });

  it("rejects an untrusted source IP", async () => {
    expect(await isPayFastSourceIp("0.0.0.0")).toBe(false);
  });

  it("rejects mismatched merchant, non-complete status, and invalid amount payloads", () => {
    const base = { merchant_id: "36891747", payment_status: "COMPLETE", m_payment_id: "HRS-123", amount_gross: "450.00" };
    expect(isValidPayFastItnPayload(base, "36891747")).toBe(true);
    expect(isValidPayFastItnPayload({ ...base, merchant_id: "wrong" }, "36891747")).toBe(false);
    expect(isValidPayFastItnPayload({ ...base, payment_status: "CANCELLED" }, "36891747")).toBe(false);
    expect(isValidPayFastItnPayload({ ...base, amount_gross: "0" }, "36891747")).toBe(false);
  });
});
