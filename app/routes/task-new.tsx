import { redirect } from 'react-router'
import { TasksChatBot } from '~/features/tasks/tasks-chatbot'
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

  const messages = chat.messages || EMPTY_MESSAGES

  return {
    chatId,
    messages,
  }
}

export default function TaskNew() {
  return <TasksChatBot />
}
