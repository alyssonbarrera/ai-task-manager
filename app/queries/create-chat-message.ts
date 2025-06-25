import prisma from 'prisma/prisma'
import type { ChatMessage } from '~/generated/prisma/client'

export type CreateChatMessageInput = {
  chatId: string
  content: string
  role: 'user' | 'assistant'
}

export async function createChatMessage({
  role,
  chatId,
  content,
}: CreateChatMessageInput): Promise<ChatMessage> {
  const message = await prisma.chatMessage.create({
    data: {
      role,
      chatId,
      content,
    },
  })

  return message
}
