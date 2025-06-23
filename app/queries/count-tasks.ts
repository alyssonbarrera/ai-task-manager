import prisma from 'prisma/prisma'

export async function countTasks(fromDate?: Date) {
  return await prisma.task.count({
    where: fromDate
      ? {
          createdAt: {
            gte: fromDate,
          },
        }
      : undefined,
  })
}
