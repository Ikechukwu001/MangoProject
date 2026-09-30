import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true, // our tables are called users, accounts, sessions...
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // same rule as before, so nobody's old password is rejected
    requireEmailVerification: true, // new accounts must confirm their email before signing in
    resetPasswordTokenExpiresIn: 60 * 60, // reset links last 1 hour
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url });
    },
    // Your old passwords are bcrypt hashes. Keep using bcrypt so they still work.
    password: {
      hash: (password) => bcrypt.hash(password, 10),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true, // people who try to sign in unverified get a fresh link
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ user, url });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    },
  },

  // If someone signs in with Google using an email that already has an account, link them.
  account: {
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // stay signed in for 30 days
    updateAge: 60 * 60 * 24,
  },

  // Replaces the old Supabase "handle_new_user" trigger: every new user gets a profile row.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db
            .insert(schema.profiles)
            .values({ id: user.id, email: user.email, fullName: user.name })
            .onConflictDoNothing();
        },
      },
    },
  },

  plugins: [nextCookies()], // keep this last
});