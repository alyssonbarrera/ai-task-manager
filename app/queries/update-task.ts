import prisma from 'prisma/prisma'
import type { Prisma } from '~/generated/prisma/client'

type UpdateTaskProps = {
  id: string
  data: Prisma.TaskUncheckedUpdateInput
}

export async function updateTask({ id, data }: UpdateTaskProps) {
  return await prisma.task.update({
    where: { id },
    data,
  })
}
