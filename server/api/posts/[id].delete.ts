export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)

  const id = parseInt(event.context.params?.id || '')

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid post ID',
    })
  }

  // Find the post
  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found',
    })
  }

  // Check ownership (or admin)
  if (post.authorId !== user.id && !user.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to delete this post',
    })
  }

  // Delete post
  await prisma.post.delete({
    where: { id },
  })

  return { success: true }
})
