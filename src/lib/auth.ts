import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../../prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.AUTH_SECRET as string,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    },
  },

  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: "#000000", // Hex color code
    logo: "/logo.png", // Absolute URL to image
  },
});
