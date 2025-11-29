export default defineNuxtRouteMiddleware((to, from) => {
  const { status, signIn } = useAuth()

  // Allow unauthenticated access to `/`, `/auth/`, and `/api/` routes
  if (to?.path === '/' || to?.path?.startsWith('/auth') || to?.path?.startsWith('/api')) {
    return
  }

  // Redirect to signin if not authenticated
  if (status.value === 'unauthenticated') {
    return navigateTo('/api/auth/signin?callbackUrl=' + to?.path)
  }
})
