import prisma from 'prisma/prisma'

export async function countUsers(fromDate?: Date) {
  return await prisma.user.count({
    where: fromDate
      ? {
          createdAt: {
            gte: fromDate,
          },
        }
      : undefined,
  })
}
