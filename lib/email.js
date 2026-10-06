// Sends emails through Resend (https://resend.com) using plain fetch, no extra package.
//
// Env vars:
//   RESEND_API_KEY  - your Resend API key
//   EMAIL_FROM      - e.g.  PharmTech Success <no-reply@yourdomain.com>
//
// While developing on your computer, if RESEND_API_KEY is missing the email is NOT
// sent. Instead the message and its link are printed in the terminal, so you can
// test password reset and verification without setting up Resend first.

const FROM = process.env.EMAIL_FROM || "PharmTechSuccess <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set, so the email could not be sent.");
    }
    console.log(`\n[email not sent - no RESEND_API_KEY]\nTo: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend error:", res.status, detail);
    throw new Error("Email could not be sent.");
  }
}

function layout({ heading, intro, buttonText, url, footer }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
      <p style="margin:0 0 16px;font-size:13px;font-weight:bold;letter-spacing:1px;color:#0d9488;">PHARMTECHSUCCESS</p>
      <h1 style="margin:0 0 12px;font-size:22px;color:#0f172a;">${heading}</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">${intro}</p>
      <a href="${url}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:12px;">${buttonText}</a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#94a3b8;">If the button doesn't work, copy this link into your browser:<br><span style="word-break:break-all;">${url}</span></p>
      <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">${footer}</p>
    </div>
  </body>
</html>`;
}

export function sendVerificationEmail({ user, url }) {
  return sendEmail({
    to: user.email,
    subject: "Confirm your email - PharmTechSuccess",
    html: layout({
      heading: "Confirm your email",
      intro: `Hi ${user.name || "there"}, tap the button below to confirm your email address and start practising.`,
      buttonText: "Confirm email",
      url,
      footer: "This link expires in 1 hour. If you didn't create an account, you can ignore this email.",
    }),
    text: `Hi ${user.name || "there"}, confirm your email for PharmTech Success:\n${url}\n\nThis link expires in 1 hour.`,
  });
}

export function sendPasswordResetEmail({ user, url }) {
  return sendEmail({
    to: user.email,
    subject: "Reset your password - PharmTechSuccess",
    html: layout({
      heading: "Reset your password",
      intro: "We got a request to reset your password. Tap the button below to choose a new one.",
      buttonText: "Reset password",
      url,
      footer: "This link expires in 1 hour. If you didn't ask for this, you can ignore this email and your password stays the same.",
    }),
    text: `Reset your PharmTech Success password:\n${url}\n\nThis link expires in 1 hour. If you didn't ask for this, ignore this email.`,
  });
}