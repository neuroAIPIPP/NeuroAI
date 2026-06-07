import { EmailType, sendEmail } from '@/lib/email/email';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';

import prisma from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },
  advanced: {
    useSecureCookies: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        type: EmailType.RESET_PASSWORD,
        params: {
          user_name: user.name || 'User',
          reset_url: url,
        },
      });
    },
    resetPasswordTokenExpiresIn: 15 * 60, // 15 minutes
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        type: EmailType.VERIFICATION,
        params: {
          user_name: user.name || 'User',
          verification_url: url,
        },
      });
    },
    sendOnSignUp: true,
    /*
     * NOTE: Sign-in resends email & returns 403 if unverified.
     * @see https://better-auth.com/docs/concepts/email to use the built in onError
     */
    sendOnSignIn: true,
    expiresIn: 15 * 60, // 15 minutes
  },
  plugins: [admin()],
});
