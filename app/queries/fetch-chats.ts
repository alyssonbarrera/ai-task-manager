import prisma from 'prisma/prisma'

export async function fetchChats() {
  return await prisma.chat.findMany({
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}
