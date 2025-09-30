import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import { prisma } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
    async signIn({ user, profile, account }) {
      if (account?.provider === "github") {
        user.username = profile?.login as string | undefined;
      }
      if (account?.provider === "facebook") {
        // Facebook doesn’t return "login", so maybe use "id" or "name"
        user.username = profile?.name?.toLocaleLowerCase().trim() as string | undefined
      }
      return true;
    }
  },
  events: {
    async createUser({ user }) {
      // Generate a username if missing
      const baseUsername =
        user.email?.split("@")[0] ||
        user.name?.replace(/\s+/g, "").toLowerCase() ||
        "user"

      let username = baseUsername
      let counter = 1

      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter}`
        counter++
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          username,
          isVerified: true,
        },
      })
    },
  },
  debug: process.env.NODE_ENV === "development",
})
