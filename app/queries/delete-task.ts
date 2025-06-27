import prisma from 'prisma/prisma'

export async function deleteTask(taskId: string) {
  await prisma.task.delete({
    where: {
      id: taskId,
    },
  })
}
