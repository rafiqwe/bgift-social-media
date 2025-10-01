import { prisma } from "@/lib/auth"
import {
  Adapter,
  AdapterUser,
  AdapterSession,
} from "next-auth/adapters"
import { Account } from "next-auth"

export const CustomAdapter: Adapter = {
  // Create user
  async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
    const newUser = await prisma.user.create({
      data: {
        email: user.email!,
        name: user.name ?? "",
        username: user.email?.split("@")[0] ?? "user",
        image: user.image,
        emailVerified: user.emailVerified,
      },
    })
    return newUser as unknown as AdapterUser
  },

  // Get user by id
  async getUser(id: string): Promise<AdapterUser | null> {
    return prisma.user.findUnique({ where: { id } }) as unknown as AdapterUser | null
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    return prisma.user.findUnique({ where: { email } }) as unknown as AdapterUser | null
  },

  // Get user by account
  async getUserByAccount({ provider, providerAccountId }): Promise<AdapterUser | null> {
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: { user: true },
    })
    return account?.user as unknown as AdapterUser | null
  },

  // Update user
  async updateUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        image: user.image ?? undefined,
        emailVerified: user.emailVerified ?? undefined,
      },
    })
    return updated as unknown as AdapterUser
  },

  // Link provider account
  async linkAccount(account: Account): Promise<void> {
    await prisma.account.create({ data: account as any })
  },

  // Create session
  async createSession(session: AdapterSession): Promise<AdapterSession> {
    const newSession = await prisma.session.create({
      data: {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      },
    })
    return newSession as unknown as AdapterSession
  },

  // Get session and user
  async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })
    if (!session) return null
    const { user, ...sess } = session
    return {
      session: sess as unknown as AdapterSession,
      user: user as unknown as AdapterUser,
    }
  },

  // Update session
  async updateSession(session: Partial<AdapterSession> & { sessionToken: string }): Promise<AdapterSession | null> {
    const updated = await prisma.session.update({
      where: { sessionToken: session.sessionToken },
      data: {
        expires: session.expires ?? undefined,
        userId: session.userId ?? undefined,
      },
    })
    return updated as unknown as AdapterSession
  },

  // Delete session
  async deleteSession(sessionToken: string): Promise<void> {
    await prisma.session.delete({ where: { sessionToken } })
  },
}
