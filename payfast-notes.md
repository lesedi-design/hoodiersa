# PayFast integration notes

Source: https://developers.payfast.co.za/docs#quickstart

The current PayFast custom integration documentation lists the sandbox process endpoint as `https://sandbox.payfast.co.za/eng/process` and live as `https://www.payfast.co.za/eng/process`. It describes a form POST containing merchant_id, merchant_key, return_url, cancel_url, notify_url, and transaction/customer fields.

Signature rules from the documentation: concatenate non-blank name/value pairs in the documented field order using `&`; append the passphrase as `&passphrase=...`; use uppercase URL encoding with spaces encoded as `+`; then MD5 the resulting parameter string and send it as the `signature` hidden input. The docs distinguish this checkout signature ordering from the API signature's alphabetical ordering.

The documentation recommends creating a Sandbox account for integration testing. The return URL is only a customer redirect; the notify URL receives ITN callbacks. Payment status must therefore be changed only after verified ITN processing.

The user's supplied live values must remain environment secrets. Sandbox mode remains active until the user supplies/sets the sandbox credentials and completes testing.

Additional current documentation details from https://developers.payfast.co.za/docs#step_4_confirm_payment:

The checkout signature uses the documented field order, skips blank values, applies `urlencode(trim(value))` to each value, appends `&passphrase=urlencode(trim(passphrase))`, and hashes the result with MD5. PayFast’s full form example posts the resulting hidden fields to the selected sandbox or live `/eng/process` endpoint. The transaction identifier is `m_payment_id`, which should carry the merchant’s unique order/payment ID and be returned in the ITN.

## HoodieRSA operational runbook

Sandbox testing sequence: keep `PAYFAST_MODE=sandbox`; confirm the sandbox credential secrets are present; add a product to the cart; complete checkout; confirm the browser posts the signed form to `https://sandbox.payfast.co.za/eng/process`; complete a PayFast sandbox payment; confirm PayFast posts the ITN to `/api/payfast/itn`; confirm the order remains pending if the ITN signature, source, merchant, payment status, order number, or amount is invalid; and confirm it becomes paid only after the ITN passes all checks.

Live switch sequence, after sandbox testing passes: set `PAYFAST_MODE=live`; keep the supplied values in `PAYFAST_LIVE_MERCHANT_ID`, `PAYFAST_LIVE_MERCHANT_KEY`, and `PAYFAST_LIVE_PASSPHRASE`; ensure the deployed HTTPS site exposes `/api/payfast/itn`; configure the PayFast merchant notify URL if needed; verify the live process endpoint resolves to `https://www.payfast.co.za/eng/process`; then make one low-value live transaction and inspect the ITN/order state before opening the drop publicly. No frontend bundle receives any merchant secret.

The implementation does not treat a browser return as proof of payment. The success screen says the payment is pending and the database payment status is changed only by a verified ITN request.
