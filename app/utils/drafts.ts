export interface Draft {
  id: string
  title: string
  content: string
  tags: string
  updatedAt: number
}

const STORAGE_KEY = 'ag_md_drafts'

export function getDrafts(): Draft[] {
  if (import.meta.server) return []
  const draftsJson = localStorage.getItem(STORAGE_KEY)
  return draftsJson ? JSON.parse(draftsJson) : []
}

export function saveDraft(draft: Draft) {
  if (import.meta.server) return
  const drafts = getDrafts()
  const index = drafts.findIndex(d => d.id === draft.id)

  if (index >= 0) {
    drafts[index] = { ...draft, updatedAt: Date.now() }
  } else {
    drafts.push({ ...draft, updatedAt: Date.now() })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}

export function deleteDraft(id: string) {
  if (import.meta.server) return
  const drafts = getDrafts()
  const newDrafts = drafts.filter(d => d.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newDrafts))
}

export function getDraft(id: string): Draft | undefined {
  const drafts = getDrafts()
  return drafts.find(d => d.id === id)
}
