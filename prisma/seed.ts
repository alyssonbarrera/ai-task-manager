import 'dotenv/config'
import { faker } from '@faker-js/faker'
import prisma from './prisma'

async function main() {
  await prisma.user.deleteMany()
  await prisma.task.deleteMany()

  // First, create 20 users
  const users = []
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 65 }),
      },
    })
    users.push(user)
  }

  for (let i = 0; i < 20; i++) {
    // Second, create a chat for each task
    const chat = await prisma.chat.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 6 }),
      },
    })

    // Third, associate the chat messages with the chat
    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: faker.lorem.paragraph({ min: 2, max: 4 }),
      },
    })

    // Finally, create 20 tasks
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
        content: faker.lorem.paragraphs(3),
        chatHistory: JSON.stringify([
          { role: 'user', content: faker.lorem.sentence() },
          { role: 'assistant', content: faker.lorem.paragraph() },
          { role: 'user', content: faker.lorem.sentence() },
        ]),
        chatId: chat.id,
      },
    })
  }

  console.log('Seed completed! Created:')
  console.log('- 20 users')
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
