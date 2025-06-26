import prisma from 'prisma/prisma'

export async function getChatMessageById(id: string) {
  const chat = await prisma.chatMessage.findUnique({
    where: { id },
  })

  return chat
}
