# HoodieRSA Full-Stack Upgrade Tasks

- [x] Read the full-stack web development and external-integration guidance.
- [x] Upgrade the static project to a full-stack project while preserving the existing Haunted Editorial storefront.
- [x] Define shared product, size, cart, checkout, order, and policy data structures.
- [x] Add product detail routes for all four collections with gallery, colorway, size, quantity, pricing, and size-guide interactions.
- [x] Add a persistent cart drawer with live quantities, subtotal, remove actions, and checkout routing.
- [x] Build the checkout form with contact details, South African province selection, order summary, shipping fee, and a graceful address/map fallback.
- [x] Prepare PayFast sandbox/live configuration placeholders and a server-side-ready payment flow with confirmation/cancel states.
- [x] Add trust badges, secure payment copy, policies, privacy notice, cookie consent, and footer links.
- [x] Add clear placeholder treatment for editable reviews and client-supplied contact/business details without fabricating testimonials.
- [x] Verify TypeScript, production build, responsive routes, cart behavior, privacy consent, and checkout states.
- [x] Save a delivery checkpoint and provide the upgraded HoodieRSA project.

## Decisions and open items

- The existing HoodieRSA brand name and Haunted Editorial visual system remain the source of truth.
- PayFast credentials remain environment placeholders until the client supplies real sandbox/live values.
- Real business contact details and any genuine customer reviews must be supplied by the client before launch.
- The map should fail gracefully to manual address entry when Google Maps is unavailable or location access is denied.
- Legal copy is a starting template and should be reviewed for POPIA compliance before launch.
- Do not fabricate customer reviews, ratings, or testimonials.
- Do not use the provided fictional brand/parody names as copied artwork; keep product motifs original.

## Acceptance checks

- [x] Every product card opens a product detail page.
- [x] Price logic matches the requested base-price and R14-per-size-step rules.
- [x] Add to Cart remains disabled until a size is chosen.
- [x] Size Guide opens from product pages and footer.
- [x] Cart subtotal and quantities update live.
- [x] Checkout includes required contact, shipping, payment, and summary states.
- [x] Privacy policy and cookie consent are accessible.
- [x] PayFast flow is visibly marked as sandbox/configuration-ready rather than falsely live.
- [x] No fake reviews or fabricated social proof are included.
- [x] Mobile and desktop layouts remain usable.

## References

- User-provided full-stack HoodieRSA brief: `/home/ubuntu/upload/pasted_content_2.txt`
- Existing HoodieRSA implementation: `/home/ubuntu/hoodiersa`
- Existing brand direction: `/home/ubuntu/hoodiersa/ideas.md`
- Existing generated product/brand assets: `/home/ubuntu/webdev-static-assets/`

## Progress

- [x] Phase 1: Scope and documentation
- [x] Phase 2: Full-stack foundation
- [x] Phase 3: Product pages, cart, and size guide
- [x] Phase 4: Checkout and PayFast-ready flow
- [x] Phase 5: Trust, policy, and privacy states
- [x] Phase 6: Verification and delivery

Last updated: 2026-08-29

---

## Style reminder

HoodieRSA uses the Haunted Editorial system: campaign-wall asymmetry, Anton display type, DM Sans utility text, ink-black surfaces, Ritual Red #B5342E, pastel collection accents only when counterweighted by dark editorial framing, and tactile grain/stitch/halftone motifs throughout.

Every new page/component should preserve this direction and include a short file-level style comment.

---

## External integration note

PayFast and Google Maps require proper full-stack configuration, credentials, and server-side handling. Any production launch must use sandbox testing first, real environment variables, webhook verification, and POPIA-reviewed legal copy.

---

## Current status

The existing static storefront is already delivered in checkpoint `0ce7d198`; this file tracks the requested scope expansion.

## Verification-discovered follow-ups

- [x] Implement a thumbnail strip and colorway-specific gallery state on every product page.
- [x] Move cart drawer access into a global app-level commerce shell so it is available across home, product, checkout, and policy routes.
- [x] Add a footer Size Guide entry point that opens the same size chart outside product pages.
- [x] Add clear PayFast configuration handling plus explicit success/cancel/failed checkout route states.
- [x] Run interaction checks for cart quantity updates and cookie-consent persistence.
- [x] Run mobile screenshots for product detail, checkout, and privacy routes.
- [x] Mark the resolved phase and delivery items only after the above follow-ups are verified.

## Final refinement gaps

- [x] Replace the duplicated gallery image with real per-colorway gallery arrays and swap the selected image set when a swatch changes.
- [x] Add a true shared main-site footer Size Guide trigger, not only the policy-page link row.

## Visual editor verification

- [x] Clean up the removed WhatsApp/footer link state so no empty anchor remains and the icon-only CTA stays accessible.

## PayFast live-credential integration

- [x] Read and record current PayFast sandbox, signature, and ITN verification requirements.
- [x] Store PayFast merchant ID, merchant key, and passphrase as environment secrets without exposing them in frontend code.
- [x] Configure explicit sandbox/live mode switching with sandbox as the active default.
- [x] Generate the signed PayFast POST payload server-side, including the passphrase in the signature.
- [x] Add the PayFast form handoff from checkout with return, cancel, and notify URLs.
- [x] Add a server ITN endpoint that validates source, signature, amount, and order identity before marking an order paid.
- [x] Ensure return_url only shows confirmation and never changes payment status.
- [x] Verify cancel flow returns to the cart and failed/invalid ITN leaves the order unpaid.
- [x] Add tests for signature generation and ITN verification safeguards.
- [x] Run sandbox-first verification and document the exact live switch steps.
- [x] Save and deliver the PayFast integration checkpoint.

## PayFast verification follow-ups

- [x] Add explicit PayFast ITN source validation using the documented PayFast source-IP allowlist and server-side validation response.
- [x] Route PayFast cancellation clearly back to checkout/cart while preserving the local cart.
- [x] Add automated ITN tests for invalid signature, mismatched order/amount, and paid-only-after-verified behavior.
- [x] Document exact sandbox testing steps and exact live switch steps without claiming an unperformed payment test passed.
- [x] Save and deliver a PayFast-specific checkpoint after these follow-ups.

## Published PayFast ITN debugging

- [x] Confirm the published production URL is used for PayFast return, cancel, and notify callbacks.
- [x] Confirm sandbox PayFast secrets are present in the published deployment and active in sandbox mode.
- [x] Add structured ITN request, verification, database-update, and response logging without logging secrets.
- [x] Verify the published ITN endpoint returns 200 only for accepted notifications and clear non-200 responses for invalid/unmatched callbacks.
- [x] Fix any signature, passphrase encoding, remote-validation, source-IP, amount, or order-persistence defect found.
- [x] Run tests/build and validate the public ITN endpoint response path.
- [x] Save a checkpoint and provide exact sandbox re-test and log-inspection instructions.

## Narrowed PayFast production fix

- [x] Reconfirm callback URLs are derived from the published request origin and never from preview or localhost.
- [x] Preserve all existing PAYFAST_SANDBOX_* values unchanged.
- [x] Verify structured ITN received/rejected/verified/paid/response logs are present and secret-free.
- [x] Verify ITN signature, passphrase, source, merchant, status, order, and amount checks without changing credential configuration.
- [x] Run checks, save a checkpoint, and provide published re-test and log instructions.

## Checkout order-save bug

- [x] Inspect published runtime logs for the checkout tRPC request and database error.
- [x] Trace the checkout payload against the server validator, Drizzle schema, and order helper.
- [x] Fix the order-save failure without changing PayFast sandbox credentials or ITN logic.
- [x] Add a useful server-side error log and a safe client-facing error message.
- [x] Run tests, typecheck, build, and a public checkout endpoint probe.
- [x] Save and deliver a checkpoint with exact re-test steps.

## Checkout size validation bug

- [x] Trace the selected size value from product page/cart persistence into checkout mutation input.
- [x] Accept valid one-character sizes such as S while still rejecting blank or malformed sizes.
- [x] Add a regression test for S, M, XL, and blank size validation.
- [x] Run tests, typecheck, build, and save a fix checkpoint.

## Cloudflare-blocked PayFast ITN

- [x] Determine whether the 403 is generated by Cloudflare or the HoodieRSA app and document the boundary.
- [x] Verify the current official PayFast ITN source-IP guidance and current ranges.
- [x] Confirm `/api/payfast/itn` remains unauthenticated and CSRF-free while requiring signature/passphrase and server-side verification.
- [x] Add or update app-side route diagnostics and Cloudflare exception guidance without using IP-only authentication.
- [x] Validate the public endpoint’s response behavior and save a checkpoint with exact Cloudflare and sandbox re-test steps.

## Cloudflare control boundary

- [ ] Enable or connect the Cloudflare account/API integration needed to create the `/api/payfast/itn` WAF/bot/rate-limit exception.
- [ ] Apply a narrow POST-route exception for `/api/payfast/itn` with PayFast CIDR allowlist while retaining app-side signature/passphrase and server validation.
