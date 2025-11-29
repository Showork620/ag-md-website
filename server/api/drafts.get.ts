export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  // Get user's draft
  const draft = await prisma.draft.findUnique({
    where: { userId: user.id },
  })

  if (!draft) {
    return null
  }

  // Check if editing flag is stale (30 minutes)
  if (draft.isEditing && draft.editingStartedAt) {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    if (draft.editingStartedAt < thirtyMinutesAgo) {
      // Reset stale editing flag
      await prisma.draft.update({
        where: { id: draft.id },
        data: { isEditing: false, editingStartedAt: null },
      })
      draft.isEditing = false
      draft.editingStartedAt = null
    }
  }

  return draft
})
