import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NuxtAuthHandler({
  secret: process.env.NUXT_AUTH_SECRET,

  providers: [
    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account?.providerAccountId) {
        return false
      }

      try {
        // Find or create user
        const existingUser = await prisma.user.findUnique({
          where: { googleId: account.providerAccountId },
        })

        if (existingUser) {
          // Check if user is banned
          if (existingUser.isBanned) {
            // Return special URL for redirect
            return '/banned'
          }

          // Update user info
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name,
              image: user.image,
              email: user.email,
            },
          })
        } else {
          // Create new user
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId,
            },
          })
        }

        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },

    async jwt({ token, user, account }) {
      if (account?.providerAccountId) {
        token.googleId = account.providerAccountId
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.googleId) {
        try {
          const user = await prisma.user.findUnique({
            where: { googleId: token.googleId as string },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              isAdmin: true,
              isBanned: true,
              canContactAdmin: true,
              banReason: true,
            },
          })

          if (user) {
            // @ts-expect-error - Adding custom fields to session
            session.user.id = user.id
            // @ts-expect-error
            session.user.isAdmin = user.isAdmin
            // @ts-expect-error
            session.user.isBanned = user.isBanned
            // @ts-expect-error
            session.user.canContactAdmin = user.canContactAdmin
            // @ts-expect-error
            session.user.banReason = user.banReason
          }
        } catch (error) {
          console.error('Session error:', error)
        }
      }

      return session
    },
  },

  pages: {
    signIn: '/',
    error: '/auth/error',
  },
})
