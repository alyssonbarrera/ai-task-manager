import prisma from 'prisma/prisma'
import type { Prisma } from '~/generated/prisma/client'

type CreateTaskProps = {
  task: Prisma.TaskUncheckedCreateInput
}

export async function createTask({ task }: CreateTaskProps) {
  return await prisma.task.create({
    data: task,
  })
}
