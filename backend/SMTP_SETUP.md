Email delivery (Resend only)

The application now sends email exclusively via Resend HTTP API. SMTP has been removed.

Backend environment variables:
- `RESEND_API_KEY` (required)
- `RESEND_FROM` (recommended), e.g. `Flow <no-reply@your-domain.com>`
- `FRONTEND_URL` (used to generate password reset links)

Setup steps:
- Verify your sending domain in Resend (add DKIM DNS records as instructed).
- Create a Production API key and set it as `RESEND_API_KEY`.
- Set a verified sender in `RESEND_FROM`.

Notes
- The reset link points to `${FRONTEND_URL}/reset?token=...`. Ensure `FRONTEND_URL` is set in production.
