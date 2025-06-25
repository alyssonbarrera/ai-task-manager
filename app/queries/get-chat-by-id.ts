import prisma from 'prisma/prisma'

export async function getChatById(chatId: string) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: true,
    },
  })

  return chat
}
