

export default defineEventHandler(async (event) => {
  const posts = await prisma.post.findMany({
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
    orderBy: { createdAt: 'desc' },
  })
  return posts
})
