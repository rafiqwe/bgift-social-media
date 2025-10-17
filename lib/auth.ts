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
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Check if a user already exists with this email
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (existingUser) {
        // If this OAuth account is not linked yet, link it
        const linkedAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
            },
          },
        });

        if (!linkedAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account!.type,
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
              access_token: account!.access_token,
              refresh_token: account!.refresh_token,
              expires_at: account!.expires_at,
              token_type: account!.token_type,
              scope: account!.scope,
              id_token: account!.id_token,
              session_state: account!.session_state as string,
            },
          });
        }
      }

      // Assign username based on provider
      if (account?.provider === "github") {
        user.username = profile?.login as string | undefined;
      }
      if (account?.provider === "facebook") {
        user.username = profile?.name?.toLowerCase().trim() as string | undefined;
      }
      if (account?.provider === "google") {
        const baseUsername =
          user.email?.split("@")[0] ||
          user.name?.replace(/\s+/g, "").toLowerCase() ||
          "user";
        user.username = baseUsername;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Generate a unique username
      const baseUsername =
        user.email?.split("@")[0] ||
        user.name?.replace(/\s+/g, "").toLowerCase() ||
        "user";

      let username = baseUsername;
      let counter = 1;

      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          username,
          isVerified: true,
        },
      });
    },
  },
  debug: process.env.NODE_ENV === "development",
});
