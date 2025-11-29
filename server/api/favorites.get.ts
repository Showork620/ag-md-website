export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  // Get favorited posts
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      post: {
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
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return favorites.map(fav => fav.post)
})
