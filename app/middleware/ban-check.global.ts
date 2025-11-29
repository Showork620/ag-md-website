export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = useAuth()

  // If user is banned, redirect to banned page
  if (session.value?.user?.isBanned) {
    return navigateTo('/banned')
  }
})
