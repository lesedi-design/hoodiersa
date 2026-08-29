# PayFast production debugging notes

The published HoodieRSA site is available at `https://hoodiersa-5xwfyoxj.manus.space/`. The public checkout route loads at `https://hoodiersa-5xwfyoxj.manus.space/checkout`.

The current client implementation derives PayFast callback URLs from `window.location.origin`, so on the published site the intended notify URL is `https://hoodiersa-5xwfyoxj.manus.space/api/payfast/itn`, not localhost or the preview host. The production deployment must still be republished after any server changes.

The public checkout currently shows the PayFast secure checkout state and does not submit with an empty cart. No live payment was submitted during this inspection.

A public probe to `https://hoodiersa-5xwfyoxj.manus.space/api/payfast/itn` returned HTTP 403 for an intentionally invalid notification, confirming that the published endpoint is reachable and rejects an untrusted source before payment mutation. No existing PayFast/ITN entries were present in the currently published runtime log query, so a fresh sandbox transaction should be used after republishing this fix.

The code now derives callback URLs server-side from `x-forwarded-host` / `x-forwarded-proto` (with request host/protocol fallback), so the published notify URL is `https://hoodiersa-5xwfyoxj.manus.space/api/payfast/itn`. Production secret availability must be confirmed in the project’s published environment before the transaction test; a reassertion request was rejected by the user, so do not claim that production secret availability is independently confirmed.
