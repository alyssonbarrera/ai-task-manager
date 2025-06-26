import { redirect } from 'react-router'
import { TasksChatBot } from '~/features/tasks/tasks-chatbot'
import type { Task } from '~/features/tasks/types'
import type { ChatMessage } from '~/generated/prisma/client'
import {
  createTask,
  getChatById,
  getChatMessageById,
  updateTask,
} from '~/queries'
import type { Route } from './+types/task-new'

const EMPTY_MESSAGES: ChatMessage[] = []
const TASKS_NEW_PATH = '/tasks/new'

function extractChatIdFromRequest(request: Request): string | null {
  const url = new URL(request.url)
  return url.searchParams.get('chatId')
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const messageId = formData.get('message_id') as string
  const taskId = formData.get('task_id') as string

  const message = await getChatMessageById(messageId)

  if (!message) {
    return { error: 'Mensagem não encontrada' }
  }

  const content = JSON.parse(message.content)

  const taskData = {
    title: content.title,
    description: content.description,
    steps: JSON.stringify(content.steps),
    acceptanceCriteria: JSON.stringify(content.acceptanceCriteria),
    suggestedTests: JSON.stringify(content.suggestedTests),
    estimatedTime: content.estimatedTime,
    implementationSuggestion: content.implementationSuggestion,
    chatMessageId: messageId,
  }

  if (taskId) {
    await updateTask({
      id: taskId,
      data: taskData,
    })
  } else {
    await createTask({
      task: taskData,
    })
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const chatId = extractChatIdFromRequest(request)

  if (!chatId) {
    return {
      chatId: null,
      messages: EMPTY_MESSAGES,
    }
  }

  const chat = await getChatById(chatId)

  if (!chat) {
    return redirect(TASKS_NEW_PATH)
  }

  const allMessages = chat.messages
  const task = allMessages[allMessages.length - 1].content
  const parsedTask = JSON.parse(task ?? '{}') as Task

  const message = chat.messages[allMessages.length - 1]
  const messageId = message.id
  const taskId = message.task?.id

  const messages = chat.messages.map(message => ({
    ...message,
    content:
      message.role === 'assistant'
        ? message.content === '{}'
          ? '🤷‍♂️ Sua mensagem gerou uma resposta inválida'
          : '✅ Solicitação atendida. Verifique o painel ao lado 👉'
        : message.content,
  }))

  return {
    chatId,
    taskId,
    messages,
    messageId,
    task: parsedTask,
  }
}

export default function TaskNew() {
  return <TasksChatBot />
}
