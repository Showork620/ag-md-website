export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  // Delete user's draft
  const draft = await prisma.draft.findUnique({
    where: { userId: user.id },
  })

  if (!draft) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Draft not found',
    })
  }

  await prisma.draft.delete({
    where: { id: draft.id },
  })

  return { success: true }
})
