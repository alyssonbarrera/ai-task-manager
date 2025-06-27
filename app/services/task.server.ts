import type { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import prisma from 'prisma/prisma'
import { z } from 'zod'
import { client } from './chat.server'

export const TaskInputSchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().optional(),
  estimatedTime: z.string().optional(),
  steps: z.string().optional(),
  suggestedTests: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  implementationSuggestion: z.string().optional(),
})

export type TaskData = z.infer<typeof TaskInputSchema>

export async function storeTaskAsEmbeddings(
  taskId: string,
  taskData: TaskData
) {
  const parsed = TaskInputSchema.safeParse(taskData)

  if (!parsed.success) {
    console.error('Validation error:', parsed.error)
    return false
  }

  const markdown = await taskToMarkdown(parsed.data)
  const chunks = await chunkMarkdownDocument(markdown)
  const embeddings = await createEmbeddingsFromDocuments(taskId, chunks)

  try {
    embeddings.forEach(e => validateEmbedding(e.embedding))

    await prisma.$transaction(async tx => {
      await tx.$executeRaw`DELETE FROM task_embeddings WHERE task_id = ${taskId}`
      for (const e of embeddings) {
        await tx.$executeRawUnsafe(
          `INSERT INTO task_embeddings (task_id, chunk_content, embedding) VALUES (?, ?, ?)`,
          taskId,
          e.chunk_content,
          JSON.stringify(e.embedding)
        )
      }
    })
    return true
  } catch (error) {
    // Log error securely
    console.error('Failed to store embeddings', error)
    return false
  }
}

function validateEmbedding(embedding: unknown) {
  if (!Array.isArray(embedding) || embedding.length !== 3072) {
    throw new Error('Invalid embedding size')
  }
  if (!embedding.every(v => typeof v === 'number')) {
    throw new Error('Embedding must be an array of numbers')
  }
}

async function taskToMarkdown(data: TaskData) {
  // Helper to format list fields
  function formatList(str?: string, bullet = '-') {
    if (!str) return ''
    return str
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => `${bullet} ${line}`)
      .join('\n')
  }

  let md = ''

  if (data.title) {
    md += `# ${data.title}\n\n`
  }
  if (data.description) {
    md += `**Descrição:**  \n${data.description}\n\n`
  }
  if (data.estimatedTime) {
    md += `**Tempo Estimado:**  \n${data.estimatedTime}\n\n`
  }
  if (data.steps) {
    md +=
      '## Passos\n\n' +
      formatList(data.steps, '1.').replace(
        /1\./g,
        (_m, i, str) => `${str.slice(0, i).split('1.').length}.`
      ) +
      '\n\n'
  }
  if (data.suggestedTests) {
    md += `## Testes Sugeridos\n\n${formatList(data.suggestedTests)}\n\n`
  }
  if (data.acceptanceCriteria) {
    md +=
      '## Critérios de Aceitação\n\n' +
      formatList(data.acceptanceCriteria) +
      '\n\n'
  }
  if (data.implementationSuggestion) {
    md += `**Sugestão de Implementação:**  \n${data.implementationSuggestion}\n`
  }

  return md.trim()
}

async function chunkMarkdownDocument(markdown: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3072,
    chunkOverlap: 300,
  })

  return await splitter.createDocuments([markdown])
}

async function createEmbeddingsFromDocuments(
  taskId: string,
  chunks: Document[]
) {
  return await Promise.all(
    chunks.map(async chunk => {
      const response = await client.embeddings.create({
        model: 'text-embedding-3-large',
        input: chunk.pageContent,
      })

      return {
        task_id: taskId,
        chunk_content: chunk.pageContent,
        embedding: response.data[0].embedding,
      }
    })
  )
}
