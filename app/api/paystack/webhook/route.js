// app/api/paystack/webhook/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify the webhook is actually from Paystack
    const expectedSignature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Webhook signature mismatch — rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Only handle successful charge events
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const { reference, metadata, amount } = event.data;
    const userId = metadata?.user_id;

    if (!userId) {
      console.error("Webhook: no user_id in metadata for reference", reference);
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Service role key bypasses RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Idempotency check
    const { data: existingRequest } = await supabase
      .from("premium_requests")
      .select("status")
      .eq("reference", reference)
      .maybeSingle();

    if (existingRequest?.status === "approved") {
      return NextResponse.json({ received: true, already_activated: true });
    }

    // Approve the request
    await supabase
      .from("premium_requests")
      .update({
        status: "approved",
        paid_at: new Date().toISOString(),
        paystack_amount_paid: amount / 100,
      })
      .eq("reference", reference);

    // Upgrade the profile
    await supabase
      .from("profiles")
      .update({
        plan: "premium",
        premium_status: "active",
      })
      .eq("id", userId);

    console.log(`Webhook: premium activated for user ${userId}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}