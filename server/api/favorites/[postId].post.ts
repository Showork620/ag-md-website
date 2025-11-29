export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const postId = parseInt(event.context.params?.postId || '')

  if (isNaN(postId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid post ID',
    })
  }

  // Check if post exists
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found',
    })
  }

  // Create favorite (ignore if already exists)
  await prisma.favorite.upsert({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
    create: {
      userId: user.id,
      postId,
    },
    update: {},
  })

  return { success: true }
})
