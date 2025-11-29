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
      statusMessage: 'You do not have permission to edit this post',
    })
  }

  const body = await readBody(event)
  const { title, content, tags } = body

  // Update post
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(content && { content }),
      ...(tags && {
        tags: {
          set: [], // Clear existing tags
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      }),
    },
    include: {
      tags: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  return updatedPost
})
