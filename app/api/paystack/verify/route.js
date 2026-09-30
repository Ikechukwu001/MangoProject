// app/api/paystack/verify/route.js
import { NextResponse } from "next/server";
import { activatePremium } from "@/lib/paystack";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "No reference provided" }, { status: 400 });
    }

    // Ask Paystack directly whether this payment really succeeded
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
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

    const { metadata, amount, currency } = paystackData.data;

    // The Paystack account is shared with NurseAssist. Never activate for its payments.
    if (metadata?.product === "nurseassist" || currency !== "NGN") {
      return NextResponse.json(
        { error: "This payment does not belong to PharmTechSuccess" },
        { status: 400 }
      );
    }

    const result = await activatePremium({
      reference,
      userId: metadata?.user_id,
      amountKobo: amount,
    });

    if (!result.ok) {
      console.error("Verify: could not activate", reference, result.reason);
      return NextResponse.json(
        { error: "We could not activate your account. Please contact support." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      already_activated: result.alreadyActivated || false,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}