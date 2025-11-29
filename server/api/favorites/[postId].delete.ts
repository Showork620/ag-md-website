export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const postId = parseInt(event.context.params?.postId || '')

  if (isNaN(postId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid post ID',
    })
  }

  // Delete favorite
  await prisma.favorite.delete({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  }).catch(() => {
    // Ignore if not found
  })

  return { success: true }
})
