import prisma from 'prisma/prisma'

export async function fetchTasks() {
  return await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      steps: true,
      estimatedTime: true,
      implementationSuggestion: true,
      acceptanceCriteria: true,
      suggestedTests: true,
      content: true,
      chatHistory: true,
    },
  })
}
