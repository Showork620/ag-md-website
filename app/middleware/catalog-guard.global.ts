export default defineNuxtRouteMiddleware((to) => {
  // カタログページへのアクセスかつ、開発環境でない場合
  if (to.path.startsWith('/catalog') && !import.meta.env.DEV) {
    return navigateTo('/')
  }
})
