import prisma from 'prisma/prisma'

export async function deleteChat(chatId: string) {
  await prisma.chat.delete({
    where: {
      id: chatId,
    },
  })
}
