import { randomUUID } from 'node:crypto'
import { redirect } from 'react-router'
import {
  type ChatMessage,
  ChatMessageRole,
  type Prisma,
} from '~/generated/prisma/client'
import { createChat } from '~/queries/create-chat'
import { createChatMessage } from '~/queries/create-chat-message'
import { fetchChatMessages } from '~/queries/fetch-chat-messages'
import { getChatCompletions } from '~/services/chat.server'
import type { Route } from './+types/api.chat'

const DEFAULT_ERROR_MESSAGE = 'Desculpe, não consegui entender a sua pergunta.'

type ChatFormData = {
  message: string
  chatId: string | null
}

type ChatMessageInput = Prisma.ChatMessageUncheckedCreateWithoutChatInput & {
  role: ChatMessageRole
}

type ProcessedChatData = {
  userMessage: ChatMessageInput
  existingMessages: ChatMessage[]
}

export async function action({ request }: Route.ActionArgs) {
  const chatData = await extractChatDataFromRequest(request)
  const { userMessage, existingMessages } = await processChatData(chatData)

  return await handleChatConversation(
    userMessage,
    existingMessages,
    chatData.chatId
  )
}

async function extractChatDataFromRequest(
  request: Request
): Promise<ChatFormData> {
  const formData = await request.formData()

  const message = formData.get('message') as string
  const chatId = formData.get('chatId') as string | null

  if (!message?.trim()) {
    throw new Error('Message is required')
  }

  return { message, chatId }
}

async function processChatData({
  message,
  chatId,
}: ChatFormData): Promise<ProcessedChatData> {
  const userMessage = createUserMessage(message)
  const existingMessages = await getExistingMessages(chatId)

  return { userMessage, existingMessages }
}

function createUserMessage(content: string): ChatMessageInput {
  return {
    id: randomUUID(),
    createdAt: new Date(),
    content: content.trim(),
    role: ChatMessageRole.user,
  }
}

async function getExistingMessages(
  chatId: string | null
): Promise<ChatMessage[]> {
  if (!chatId) return []
  return await fetchChatMessages(chatId)
}

async function handleChatConversation(
  userMessage: ChatMessageInput,
  existingMessages: ChatMessage[],
  chatId: string | null
): Promise<Response | undefined> {
  const conversationHistory = [...existingMessages, userMessage]
  const assistantResponse = await getAssistantResponse(conversationHistory)
  const assistantMessage = createAssistantMessage(assistantResponse)

  if (chatId) {
    await createChatMessage({
      chatId,
      content: userMessage.content,
      role: ChatMessageRole.user,
    })

    await createChatMessage({
      chatId,
      content: assistantMessage.content,
      role: ChatMessageRole.assistant,
    })

    return undefined
  }

  const newChat = await createChat([userMessage, assistantMessage])
  return redirect(`/tasks/new?chatId=${newChat.id}`)
}

async function getAssistantResponse(
  messages: ChatMessageInput[]
): Promise<string> {
  try {
    return (await getChatCompletions(messages)) || DEFAULT_ERROR_MESSAGE
  } catch (error) {
    console.error('Failed to get assistant response:', error)
    return DEFAULT_ERROR_MESSAGE
  }
}

function createAssistantMessage(content: string): ChatMessageInput {
  return {
    content,
    id: randomUUID(),
    role: ChatMessageRole.assistant,
    createdAt: new Date(),
  }
}
