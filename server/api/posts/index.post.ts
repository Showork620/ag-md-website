export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)

  const body = await readBody(event)

  const { title, content, tags } = body

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and content are required',
    })
  }

  // Create post with tags and author
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: user.id,
      tags: {
        connectOrCreate: tags?.map((tagName: string) => ({
          where: { name: tagName },
          create: { name: tagName },
        })) || [],
      },
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

  return post
})
