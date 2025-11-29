export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const { title, content, tags, isEditing } = body

  // Upsert draft (create or update)
  const draft = await prisma.draft.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      title: title || '',
      content: content || '',
      tags: tags || '',
      isEditing: isEditing ?? false,
      editingStartedAt: isEditing ? new Date() : null,
    },
    update: {
      title: title || '',
      content: content || '',
      tags: tags || '',
      isEditing: isEditing ?? false,
      editingStartedAt: isEditing ? new Date() : (isEditing === false ? null : undefined),
    },
  })

  return draft
})
