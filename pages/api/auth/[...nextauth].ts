import NextAuth, { type NextAuthOptions } from "next-auth"
import prisma from "../../../lib/prismadb"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials";
import sha256 from "crypto-js/sha256";
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string(),
  password: z.string()
})

// authorize stuff stolen from https://github.com/mikemajara/nextjs-prisma-next-auth-credentials/blob/main/pages/api/user/check-credentials.ts
export const authOptions: NextAuthOptions  = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, email, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        const { email, password } = await credentialsSchema.parseAsync(credentials)

        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findFirst({
          where: {
            email
          },
          select: {
            id: true,
            email: true,
            password: true
          },
        })
  
        if (user && user.password === hashPassword(password)) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {

          // to make this simple, if the user doesn't exist lets just create one here

          const user = await prisma.user.create({
            data: { 
              email, 
              password: hashPassword(password)
            },
          });

          return user;

          // // If you return null then an error will be displayed advising the user to check their details.
          // return null
  
          // // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
}

export default NextAuth(authOptions)

// https://github.com/mikemajara/nextjs-prisma-next-auth-credentials/blob/8add311aca7a91ad9ab242bb10eaf7211cbf179c/pages/api/user/create.ts#L19
const hashPassword = (password: string) => {
  return sha256(password).toString();
};