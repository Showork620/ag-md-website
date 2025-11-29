

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      tags: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found',
    })
  }

  return post
})
