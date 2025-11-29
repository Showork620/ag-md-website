import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Hello Nuxt',
      content: '# Hello Nuxt\n\nThis is my first post in Nuxt.',
      tags: {
        connectOrCreate: {
          where: { name: 'general' },
          create: { name: 'general' },
        },
      },
    },
  })

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Markdown Features',
      content: '# Markdown Features\n\n- List item\n- **Bold**\n- *Italic*',
      tags: {
        connectOrCreate: {
          where: { name: 'markdown' },
          create: { name: 'markdown' },
        },
      },
    },
  })

  console.log({ post1, post2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
