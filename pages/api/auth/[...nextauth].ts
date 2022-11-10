import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

const env = envSchema.parse(process.env)

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)