import { getServerSession } from '#auth'
import type { H3Event } from 'h3'

export async function requireAuth(event: H3Event) {
  const session = await getServerSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - Login required',
    })
  }

  // Check if user is banned
  if (session.user.isBanned) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden - User is banned',
    })
  }

  return session.user
}

export async function getOptionalAuth(event: H3Event) {
  const session = await getServerSession(event)
  return session?.user || null
}

export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event)

  if (!user.isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden - Admin access required',
    })
  }

  return user
}
