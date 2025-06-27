import 'dotenv/config'
import { faker } from '@faker-js/faker'
import prisma from './prisma'

async function main() {
  await prisma.chatMessage.deleteMany()
  await prisma.chat.deleteMany()
  await prisma.task.deleteMany()

  for (let i = 0; i < 20; i++) {
    const chat = await prisma.chat.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 6 }),
      },
    })

    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: faker.lorem.paragraph({ min: 2, max: 4 }),
      },
    })

    await prisma.task.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 6 }),
        description: faker.lorem.paragraph({ min: 2, max: 4 }),
        steps: JSON.stringify([
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
        ]),
        estimatedTime: `${faker.number.int({ min: 1, max: 8 })}d`,
        implementationSuggestion: faker.lorem.paragraphs(2),
        acceptanceCriteria: JSON.stringify([
          faker.lorem.sentence(),
          faker.lorem.sentence(),
        ]),
        suggestedTests: JSON.stringify([
          `Test: ${faker.lorem.sentence()}`,
          `Test: ${faker.lorem.sentence()}`,
        ]),
        chatMessageId: chat.id,
      },
    })
  }

  console.log('Seed completed! Created:')
  console.log('- 20 chats')
  console.log('- 20 chat messages')
  console.log('- 20 tasks')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
