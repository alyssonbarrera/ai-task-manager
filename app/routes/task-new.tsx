import { redirect } from 'react-router'
import { TasksChatBot } from '~/features/tasks/tasks-chatbot'
import type { Task } from '~/features/tasks/types'
import type { ChatMessage } from '~/generated/prisma/client'
import { getChatById } from '~/queries/get-chat-by-id'
import type { Route } from './+types/task-new'

const EMPTY_MESSAGES: ChatMessage[] = []
const TASKS_NEW_PATH = '/tasks/new'

function extractChatIdFromRequest(request: Request): string | null {
  const url = new URL(request.url)
  return url.searchParams.get('chatId')
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
    messages,
    task: parsedTask,
  }
}

export default function TaskNew() {
  return <TasksChatBot />
}
