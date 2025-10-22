// backend/src/utils/mailer.js
// Resend-only mailer. SMTP has been removed.

export async function sendMail({ to, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. SMTP has been disabled.");
  }

  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  const payload = {
    from,
    to,
    subject,
    html: html || (text ? `<pre>${String(text)}</pre>` : ""),
    text: text || undefined,
  };

  const doFetch = typeof fetch === "function"
    ? fetch
    : (...args) => import("node-fetch").then(({ default: f }) => f(...args));

  const res = await doFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend API failed: ${res.status} ${body}`);
  }
  return res.json();
}

