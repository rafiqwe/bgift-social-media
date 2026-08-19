import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { db } from "@/lib/db";

// Helper function to generate a quick, unique username fallback
const generateUsername = (email?: string | null, name?: string | null) => {
  const base = email?.split("@")[0] || name?.replace(/\s+/g, "").toLowerCase() || "user";
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}_${suffix}`;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
          username: generateUsername(profile.email, profile.name),
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: profile.email ? new Date() : null,
          username: profile.login || generateUsername(profile.email, profile.name),
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          emailVerified: profile.email ? new Date() : null,
          username: generateUsername(profile.email, profile.name),
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      return !!user.email;
    },

    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id as string;
      }

      if (token.id && (account || trigger === "update")) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            username: true,
            isVerified: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.image = dbUser.image;
          token.username = dbUser.username;
          token.isVerified = dbUser.isVerified;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
  // You can clean up or remove the events block entirely now
  debug: process.env.NODE_ENV === "development",
});
