# Cloudflare and PayFast ITN notes

PayFast’s current developer documentation states that ITN notify callbacks use ports 80, 8080, 8081, and 443. The official IP block shown in the documentation is:

| CIDR | Address range |
|---|---|
| 197.97.145.144/28 | 197.97.145.144–197.97.145.159 |
| 41.74.179.192/27 | 41.74.179.192–41.74.179.223 |
| 102.216.36.0/28 | 102.216.36.0–102.216.36.15 |
| 102.216.36.128/28 | 102.216.36.128–102.216.36.143 |
| 144.126.193.139/32 | 144.126.193.139 |

PayFast’s custom integration documentation requires the ITN callback to verify the security signature and verify that the source IP belongs to PayFast. The notify route must remain reachable without login or CSRF tokens; authenticity is established by PayFast signature/passphrase verification, source validation, and server-side validation.

Cloudflare WAF, Bot Fight Mode, rate limiting, and managed rules are provider-side controls. The HoodieRSA app can expose a public unauthenticated POST route and validate it, but it cannot create or modify a Cloudflare firewall rule from the project runtime. The required Cloudflare exception must be created in the Cloudflare dashboard for `/api/payfast/itn`, limited to POST, with PayFast source ranges above allowed or the route’s managed rules skipped while retaining app-side ITN verification.

Reference: https://developers.payfast.co.za/docs#ports-ips
