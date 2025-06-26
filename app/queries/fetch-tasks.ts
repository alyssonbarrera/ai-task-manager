import prisma from 'prisma/prisma'

export async function fetchTasks() {
  return await prisma.task.findMany({
    include: {
      chatMessage: true,
    },
  })
}
