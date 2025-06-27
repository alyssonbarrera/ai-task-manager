import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { ChatsList } from '~/features/chats/chats-list'
import { deleteChat, fetchChats, updateChat } from '~/queries'
import type { Route } from './+types/chats'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const action = formData.get('_action') as string
  const chatId = formData.get('chatId') as string

  if (!chatId) {
    return { success: false, error: 'Chat ID é obrigatório' }
  }

  try {
    switch (action) {
      case 'updateTitle': {
        const title = formData.get('title') as string
        if (!title) {
          return { success: false, error: 'Título é obrigatório' }
        }
        await updateChat(chatId, { title })
        return { success: true, action: 'updateTitle' }
      }

      case 'deleteChat': {
        await deleteChat(chatId)
        return { success: true, action: 'deleteChat' }
      }

      default:
        return { success: false, error: 'Ação não reconhecida' }
    }
  } catch (error) {
    console.error('Erro na ação do chat:', error)
    return {
      success: false,
      error:
        action === 'deleteChat'
          ? 'Erro ao excluir chat'
          : 'Erro ao atualizar chat',
    }
  }
}

export async function loader() {
  const chats = await fetchChats()

  return {
    chats,
  }
}

export function HydrateFallback() {
  return <div>Loading...</div>
}

export default function Chats() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Chats</CardTitle>
          <CardDescription>Confira os chats do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <ChatsList />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
