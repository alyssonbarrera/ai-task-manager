import prisma from 'prisma/prisma'

export async function getTaskById(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      chatMessage: true,
    },
  })

  return task
}
