import prisma from 'prisma/prisma'

export async function fetchUsers() {
  return await prisma.user.findMany()
}
