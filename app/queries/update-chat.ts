import prisma from 'prisma/prisma'
import type { Chat, Prisma } from '~/generated/prisma/client'

export async function updateChat(
  chatId: string,
  data: Prisma.ChatUpdateInput
): Promise<Chat> {
  return await prisma.chat.update({
    where: { id: chatId },
    data,
  })
}
