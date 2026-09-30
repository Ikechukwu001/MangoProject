// app/api/paystack/webhook/route.js  (PharmTechSuccess)
//
// This is the ONLY webhook URL registered on the shared Paystack account, so
// events for every product arrive here. NurseAssist events (metadata.product
// === "nurseassist") are forwarded untouched to NurseAssist. Everything else is
// handled here.
//
// Requires env var:
//   NURSEASSIST_WEBHOOK_URL=https://<nurseassist-domain>/api/paystack/webhook
import { NextResponse } from "next/server";
import crypto from "crypto";
import { activatePremium } from "@/lib/paystack";

function signatureIsValid(rawBody, signature) {
  if (!signature || !process.env.PAYSTACK_SECRET_KEY) return false;

  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify the webhook is actually from Paystack
    if (!signatureIsValid(rawBody, signature)) {
      console.warn("Webhook signature mismatch — rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Only handle successful charge events
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const { reference, metadata, amount, currency } = event.data;

    // ---- Forward other products' events (NurseAssist) ----
    if (metadata?.product === "nurseassist") {
      const forwardUrl = process.env.NURSEASSIST_WEBHOOK_URL;

      if (!forwardUrl) {
        console.error("NURSEASSIST_WEBHOOK_URL is not set; cannot forward", reference);
        return NextResponse.json({ error: "Forward target not configured" }, { status: 500 });
      }

      try {
        const forwardResponse = await fetch(forwardUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Same raw body + same header = signature stays valid downstream
            "x-paystack-signature": signature,
          },
          body: rawBody,
        });

        if (!forwardResponse.ok) {
          console.error("NurseAssist webhook responded", forwardResponse.status, reference);
          // Non-2xx makes Paystack retry the delivery
          return NextResponse.json({ error: "Forward failed" }, { status: 502 });
        }

        return NextResponse.json({ received: true, forwarded: "nurseassist" });
      } catch (forwardError) {
        console.error("Failed to forward to NurseAssist:", forwardError);
        return NextResponse.json({ error: "Forward failed" }, { status: 502 });
      }
    }

    // ---- PharmTechSuccess handling ----
    const userId = metadata?.user_id;

    if (!userId) {
      console.error("Webhook: no user_id in metadata for reference", reference);
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    if (currency && currency !== "NGN") {
      console.error("Webhook: unexpected currency", currency, reference);
      return NextResponse.json({ received: true, ignored: "currency" });
    }

    const result = await activatePremium({ reference, userId, amountKobo: amount });

    if (!result.ok) {
      // Acknowledge so Paystack doesn't retry forever, but leave a loud log.
      console.error("Webhook: could not activate", reference, result.reason);
      return NextResponse.json({ received: true, activated: false, reason: result.reason });
    }

    console.log(`Webhook: premium activated for user ${userId}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}