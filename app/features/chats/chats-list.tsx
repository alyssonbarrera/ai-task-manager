import {
  Edit,
  MessageCircle,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react'
import { Link, useLoaderData } from 'react-router'

import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { loader } from '~/routes/dashboard'

type Chat = {
  id: string
  title: string | null
  createdAt: Date
  messages: Array<{
    id: string
    content: string
    role: string
    createdAt: Date
  }>
}

export function ChatsList() {
  const { chats } = useLoaderData<typeof loader>()

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    })
  }

  const getLastMessage = (chat: Chat) => {
    if (chat.messages && chat.messages?.length > 0) {
      const lastMessage = chat.messages[0]
      return lastMessage.content.length > 50
        ? `${lastMessage.content.substring(0, 50)}...`
        : lastMessage.content
    }
    return 'Nenhuma mensagem'
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Título</TableHead>
          <TableHead className="w-[300px]">Última Mensagem</TableHead>
          <TableHead className="w-[100px]">Mensagens</TableHead>
          <TableHead className="w-[180px]">Criado em</TableHead>
          <TableHead className="w-[120px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chats?.length > 0 ? (
          chats.map((chat: Chat) => (
            <TableRow key={chat.id}>
              <TableCell className="font-medium">
                {chat.title || `${chat.id}`}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getLastMessage(chat)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {chat.messages?.length || 0}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(chat.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link to={`/tasks/new?chatId=${chat.id}`}>
                    <SquareArrowOutUpRight className="h-4 w-4" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    title="Excluir chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              Nenhum chat encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
