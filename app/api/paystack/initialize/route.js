// app/api/paystack/initialize/route.js
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, profiles, premiumRequests } from "@/db";
import { getSession } from "@/lib/session";
import { PREMIUM_PRICE_KOBO, PREMIUM_PRICE_NAIRA } from "@/lib/paystack";

export async function POST() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;

    // Check if already premium
    const [profile] = await db
      .select({
        plan: profiles.plan,
        premiumStatus: profiles.premiumStatus,
        fullName: profiles.fullName,
      })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    if (profile?.plan?.trim() === "premium" || profile?.premiumStatus === "active") {
      return NextResponse.json(
        { error: "Account already has premium access" },
        { status: 400 }
      );
    }

    // Reuse an existing pending Paystack checkout to avoid duplicates
    const [existingRequest] = await db
      .select()
      .from(premiumRequests)
      .where(
        and(
          eq(premiumRequests.userId, user.id),
          eq(premiumRequests.status, "pending"),
          eq(premiumRequests.paymentMethod, "paystack")
        )
      )
      .orderBy(desc(premiumRequests.createdAt))
      .limit(1);

    if (existingRequest?.paystackAccessCode) {
      return NextResponse.json({
        authorization_url: existingRequest.paystackAuthorizationUrl,
        access_code: existingRequest.paystackAccessCode,
        reference: existingRequest.reference,
      });
    }

    const fullName = profile?.fullName || user.name || "Student";

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

    // Save the pending request
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

    // Mark profile as pending
    await db
      .update(profiles)
      .set({ premiumStatus: "pending" })
      .where(eq(profiles.id, user.id));

    return NextResponse.json({ authorization_url, access_code, reference });
  } catch (error) {
    console.error("Initialize payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}