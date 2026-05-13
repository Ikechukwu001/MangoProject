// app/api/paystack/verify/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server"; // adjust to your server supabase client path

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "No reference provided" },
        { status: 400 }
      );
    }

    // Verify with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data?.status !== "success") {
      return NextResponse.json(
        {
          error: "Payment not successful",
          paystack_status: paystackData.data?.status,
        },
        { status: 400 }
      );
    }

    const { metadata, customer, amount } = paystackData.data;
    const userId = metadata?.user_id;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user_id in payment metadata" },
        { status: 400 }
      );
    }

    // Use service role client here since this runs server-side after redirect
    // (user session may not be available in the request)
    const supabase = await createClient();

    // Idempotency: check if already activated
    const { data: existingRequest } = await supabase
      .from("premium_requests")
      .select("status")
      .eq("reference", reference)
      .maybeSingle();

    if (existingRequest?.status === "approved") {
      // Already processed — safe to return success
      return NextResponse.json({ success: true, already_activated: true });
    }

    // Update the premium_request to approved
    await supabase
      .from("premium_requests")
      .update({
        status: "approved",
        paid_at: new Date().toISOString(),
        paystack_amount_paid: amount / 100, // convert kobo to naira
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}