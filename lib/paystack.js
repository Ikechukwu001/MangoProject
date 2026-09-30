import { eq } from "drizzle-orm";
import { db, users, profiles, premiumRequests } from "@/db";

export const PREMIUM_PRICE_NAIRA = 3000;
export const PREMIUM_PRICE_KOBO = PREMIUM_PRICE_NAIRA * 100;

// Shared by the verify route and the webhook, so both behave identically.
// Call it only AFTER Paystack has confirmed the payment succeeded.
//   reference  - the Paystack reference
//   userId     - user_id from the payment metadata (may be undefined)
//   amountKobo - the amount Paystack says was actually paid
export async function activatePremium({ reference, userId, amountKobo }) {
  if (!Number.isFinite(amountKobo) || amountKobo < PREMIUM_PRICE_KOBO) {
    return { ok: false, reason: "amount_too_low" };
  }

  const [request] = await db
    .select()
    .from(premiumRequests)
    .where(eq(premiumRequests.reference, reference))
    .limit(1);

  // Already handled (by the webhook or an earlier verify call)
  if (request?.status === "verified") {
    return { ok: true, alreadyActivated: true };
  }

  // Our own record of who started this payment wins over the metadata.
  if (request && userId && request.userId !== userId) {
    return { ok: false, reason: "user_mismatch" };
  }

  const ownerId = request?.userId ?? userId;
  if (!ownerId) return { ok: false, reason: "no_user" };

  const [owner] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, ownerId))
    .limit(1);

  if (!owner) return { ok: false, reason: "unknown_user" };

  // 1) Give access first. This step is safe to repeat.
  await db
    .update(profiles)
    .set({ plan: "premium", premiumStatus: "active" })
    .where(eq(profiles.id, ownerId));

  // 2) Record the payment.
  const paidFields = {
    status: "verified",
    paidAt: new Date(),
    paystackAmountPaid: String(amountKobo / 100),
    updatedAt: new Date(),
  };

  if (request) {
    await db
      .update(premiumRequests)
      .set(paidFields)
      .where(eq(premiumRequests.reference, reference));
  } else {
    // Paid, but we never saved the request (for example the server stopped
    // right after starting checkout). Create the record so nothing is lost.
    await db.insert(premiumRequests).values({
      userId: ownerId,
      email: owner.email,
      fullName: owner.name,
      amount: PREMIUM_PRICE_NAIRA,
      reference,
      paymentMethod: "paystack",
      ...paidFields,
    });
  }

  return { ok: true };
}