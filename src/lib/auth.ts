import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// Import PrismaClient from @prisma/client/edge and withAccelerate
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Instantiate PrismaClient with Accelerate
const prisma = new PrismaClient().$extends(withAccelerate());

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
