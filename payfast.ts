/* HoodieRSA PayFast adapter — all credentials and verification stay server-side. */
import crypto from "node:crypto";
import dns from "node:dns/promises";

export const PAYFAST_ENDPOINTS = {
  sandbox: "https://sandbox.payfast.co.za/eng/process",
  live: "https://www.payfast.co.za/eng/process",
} as const;

export type PayFastFields = Record<string, string>;

export function getPayFastConfig() {
  const mode = process.env.PAYFAST_MODE === "live" ? "live" : "sandbox";
  const prefix = mode === "live" ? "PAYFAST_LIVE" : "PAYFAST_SANDBOX";
  const merchantId = process.env[`${prefix}_MERCHANT_ID`] || "";
  const merchantKey = process.env[`${prefix}_MERCHANT_KEY`] || "";
  const passphrase = process.env[`${prefix}_PASSPHRASE`] || "";
  return { mode, merchantId, merchantKey, passphrase, configured: Boolean(merchantId && merchantKey && passphrase), endpoint: PAYFAST_ENDPOINTS[mode], validateEndpoint: `${PAYFAST_ENDPOINTS[mode].replace("/eng/process", "")}/eng/query/validate` };
}

function encodePayFast(value: string) { return encodeURIComponent(value.trim()).replace(/%20/g, "+"); }

export function generatePayFastSignature(fields: PayFastFields, passphrase: string) {
  const pairs = Object.entries(fields).filter(([, value]) => value !== "" && value !== undefined).map(([key, value]) => `${key}=${encodePayFast(value)}`);
  const parameterString = [...pairs, `passphrase=${encodePayFast(passphrase)}`].join("&");
  return crypto.createHash("md5").update(parameterString).digest("hex");
}

export function preparePayFastPayload(input: { amount: number; orderNumber: string; returnUrl: string; cancelUrl: string; notifyUrl: string; name: string; email: string; phone?: string }) {
  const config = getPayFastConfig();
  if (!config.configured) return { configured: false as const, endpoint: config.endpoint, reason: "PayFast credentials are not configured for the selected mode" };
  const [firstName, ...lastName] = input.name.trim().split(/\s+/);
  const fields: PayFastFields = {
    merchant_id: config.merchantId, merchant_key: config.merchantKey, return_url: input.returnUrl, cancel_url: input.cancelUrl,
    notify_url: input.notifyUrl, name_first: firstName || input.name, name_last: lastName.join(" "), email_address: input.email,
    cell_number: input.phone || "", m_payment_id: input.orderNumber, amount: input.amount.toFixed(2), item_name: `HoodieRSA order ${input.orderNumber}`,
  };
  return { configured: true as const, endpoint: config.endpoint, fields: { ...fields, signature: generatePayFastSignature(fields, config.passphrase) } };
}

const PAYFAST_PUBLISHED_RANGES = ["197.97.145.144/28", "41.74.179.192/27", "102.216.36.0/28", "102.216.36.128/28", "144.126.193.139/32"];
function ipv4ToNumber(ip: string) { return ip.split(".").reduce((value, octet) => (value * 256) + Number(octet), 0); }
function inCidr(ip: string, cidr: string) { const [network, bitsText] = cidr.split("/"); const bits = Number(bitsText); const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0; return (ipv4ToNumber(ip) & mask) === (ipv4ToNumber(network) & mask); }

export async function isPayFastSourceIp(ip: string | undefined) {
  if (!ip) return false;
  const normalized = ip.replace(/^::ffff:/, "");
  const configured = (process.env.PAYFAST_TRUSTED_IPS || "").split(",").map((value) => value.trim()).filter(Boolean);
  if (configured.includes(normalized) || PAYFAST_PUBLISHED_RANGES.some((range) => inCidr(normalized, range))) return true;
  const config = getPayFastConfig();
  const host = config.mode === "live" ? "www.payfast.co.za" : "sandbox.payfast.co.za";
  try {
    const addresses = await dns.resolve4(host);
    return addresses.includes(normalized);
  } catch {
    return false;
  }
}

export function verifyPayFastSignature(fields: PayFastFields) {
  const config = getPayFastConfig();
  if (!config.configured || !fields.signature) return false;
  const unsigned = Object.fromEntries(Object.entries(fields).filter(([key]) => key !== "signature"));
  const expected = generatePayFastSignature(unsigned, config.passphrase);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(fields.signature));
}

export function isValidPayFastItnPayload(fields: PayFastFields, expectedMerchant: string) {
  const paymentStatus = fields.payment_status?.toUpperCase();
  const amount = fields.amount_gross || fields.amount;
  return Boolean(expectedMerchant && fields.merchant_id === expectedMerchant && paymentStatus === "COMPLETE" && fields.m_payment_id && amount && Number.isFinite(Number(amount)) && Number(amount) > 0);
}

export async function validatePayFastItn(fields: PayFastFields) {
  const config = getPayFastConfig();
  if (!config.configured || !verifyPayFastSignature(fields)) return false;
  const body = new URLSearchParams(fields).toString();
  const response = await fetch(config.validateEndpoint, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "HoodieRSA PayFast ITN/1.0" }, body });
  const text = (await response.text()).trim().toUpperCase();
  return response.ok && text === "VERIFIED";
}
