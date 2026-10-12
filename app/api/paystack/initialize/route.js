
// app/api/paystack/initialize/route.js

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, profiles, premiumRequests } from "@/db";
import { getSession } from "@/lib/session";
import {
  PREMIUM_PRICE_KOBO,
  PREMIUM_PRICE_NAIRA,
} from "@/lib/paystack";

export async function POST() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user } = session;

    // Check the user's current premium status.
    const [profile] = await db
      .select({
        plan: profiles.plan,
        premiumStatus: profiles.premiumStatus,
        fullName: profiles.fullName,
      })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    if (
      profile?.plan?.trim().toLowerCase() === "premium" ||
      profile?.premiumStatus === "active"
    ) {
      return NextResponse.json(
        { error: "Account already has premium access" },
        { status: 400 }
      );
    }

    const fullName = profile?.fullName || user.name || "Student";

    // ALWAYS initialize a fresh Paystack transaction.
    // Never reuse an old pending checkout or access code.
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
            product: "pharmtechsuccess",
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
        cache: "no-store",
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack initialization failed:", paystackData);

      return NextResponse.json(
        {
          error:
            paystackData.message ||
            "Failed to initialize payment. Please try again.",
        },
        { status: 502 }
      );
    }

    const {
      authorization_url,
      access_code,
      reference,
    } = paystackData.data;

    // Save this attempt as its own payment record.
    // Each new attempt has its own unique Paystack reference.
    await db.insert(premiumRequests).values({
      userId: user.id,
      email: user.email,
      fullName,
      amount: PREMIUM_PRICE_NAIRA,
      reference,
      status: "pending",
      paymentMethod: "paystack",
      paystackAccessCode: access_code,
      paystackAuthorizationUrl: authorization_url,
    });

    // Keep the profile pending until a verified successful payment.
    await db
      .update(profiles)
      .set({ premiumStatus: "pending" })
      .where(eq(profiles.id, user.id));

    return NextResponse.json({
      authorization_url,
      access_code,
      reference,
    });
  } catch (error) {
    console.error("Initialize payment error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}