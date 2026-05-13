// app/api/paystack/initialize/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

const PREMIUM_PRICE_KOBO = 300000; // ₦3,000 in kobo

export async function POST(request) {
  try {
    const supabase = await createClient(); // ← was missing await

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if already premium
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, premium_status, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.plan === "premium" || profile?.premium_status === "active") {
      return NextResponse.json(
        { error: "Account already has premium access" },
        { status: 400 }
      );
    }

    // Check for existing pending Paystack request to avoid duplicates
    const { data: existingRequest } = await supabase
      .from("premium_requests")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .eq("payment_method", "paystack")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingRequest?.paystack_access_code) {
      return NextResponse.json({
        authorization_url: existingRequest.paystack_authorization_url,
        access_code: existingRequest.paystack_access_code,
        reference: existingRequest.reference,
      });
    }

    const fullName =
      profile?.full_name || user.user_metadata?.full_name || "Student";

    // Initialize transaction with Paystack
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: PREMIUM_PRICE_KOBO,
          currency: "NGN",
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing/verify`,
          metadata: {
            user_id: user.id,
            full_name: fullName,
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "full_name",
                value: fullName,
              },
            ],
          },
        }),
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error("Paystack init error:", paystackData);
      return NextResponse.json(
        { error: paystackData.message || "Failed to initialize payment" },
        { status: 500 }
      );
    }

    const { authorization_url, access_code, reference } = paystackData.data;

    // Save pending request to Supabase
    await supabase.from("premium_requests").insert({
      user_id: user.id,
      email: user.email,
      full_name: fullName,
      amount: 3000,
      reference,
      status: "pending",
      payment_method: "paystack",
      paystack_access_code: access_code,
      paystack_authorization_url: authorization_url,
    });

    // Mark profile as pending
    await supabase
      .from("profiles")
      .update({ premium_status: "pending" })
      .eq("id", user.id);

    return NextResponse.json({ authorization_url, access_code, reference });
  } catch (error) {
    console.error("Initialize payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}