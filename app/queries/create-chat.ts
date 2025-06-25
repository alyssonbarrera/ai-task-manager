import prisma from 'prisma/prisma'

import type { Chat, Prisma } from '~/generated/prisma/client'

export async function createChat(
  messages: Prisma.ChatMessageUncheckedCreateWithoutChatInput[]
): Promise<Chat> {
  return await prisma.chat.create({
    data: {
      messages: {
        create: messages.map(message => ({
          role: message.role,
          content: message.content,
          createdAt: message.createdAt,
        })),
      },
    },
  })
}
