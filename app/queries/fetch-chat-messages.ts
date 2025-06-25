import prisma from 'prisma/prisma'
import type { ChatMessage } from '~/generated/prisma/client'

export async function fetchChatMessages(
  chatId: string
): Promise<ChatMessage[]> {
  const messages = await prisma.chatMessage.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
  })

  return messages
}
