// app/api/paystack/verify/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    const { metadata, amount } = paystackData.data;
    const userId = metadata?.user_id;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user_id in payment metadata" },
        { status: 400 }
      );
    }

    // Use service role key — bypasses RLS so updates always work
    // even when there is no user session (server-side redirect)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Idempotency: check if already activated
    const { data: existingRequest } = await supabase
      .from("premium_requests")
      .select("status")
      .eq("reference", reference)
      .maybeSingle();

    if (existingRequest?.status === "approved") {
      return NextResponse.json({ success: true, already_activated: true });
    }

    // Update premium_requests to approved
    const { error: requestError } = await supabase
      .from("premium_requests")
      .update({
        status: "approved",
        paid_at: new Date().toISOString(),
        paystack_amount_paid: amount / 100,
      })
      .eq("reference", reference);

    if (requestError) {
      console.error("Failed to update premium_requests:", requestError);
    }

    // Upgrade the profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        plan: "premium",
        premium_status: "active",
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Failed to update profile:", profileError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}