import { Check, Edit, MessageCircle, Trash2, X } from 'lucide-react'
import { startTransition, useOptimistic, useState } from 'react'
import { Link, useFetcher, useLoaderData } from 'react-router'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
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

type OptimisticUpdate =
  | { type: 'update'; id: string; title: string }
  | { type: 'delete'; id: string }

export function ChatsList() {
  const { chats } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const fetcherDelete = useFetcher()
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const [optimisticChats, updateOptimisticChats] = useOptimistic(
    chats,
    (currentChats: typeof chats, optimisticUpdate: OptimisticUpdate) => {
      if (optimisticUpdate.type === 'update') {
        return currentChats.map(chat =>
          chat.id === optimisticUpdate.id
            ? { ...chat, title: optimisticUpdate.title }
            : chat
        )
      }
      if (optimisticUpdate.type === 'delete') {
        return currentChats.filter(chat => chat.id !== optimisticUpdate.id)
      }
      return currentChats
    }
  )

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

  const handleEditStart = (chat: Chat) => {
    setEditingChatId(chat.id)
    setEditTitle(chat.title || '')
  }

  const handleEditCancel = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleEditSave = (chatId: string) => {
    if (!editTitle.trim()) return

    updateOptimisticChats({
      type: 'update',
      id: chatId,
      title: editTitle.trim(),
    })

    setEditingChatId(null)
    setEditTitle('')

    startTransition(async () => {
      await fetcher.submit(
        { chatId, title: editTitle.trim(), _action: 'updateTitle' },
        { method: 'POST', action: '/chats' }
      )
    })
  }

  const handleDelete = (chatId: string) => {
    updateOptimisticChats({ type: 'delete', id: chatId })

    startTransition(async () => {
      await fetcherDelete.submit(
        { chatId, _action: 'deleteChat' },
        { method: 'POST', action: '/chats' }
      )
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleEditSave(chatId)
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">ID</TableHead>
          <TableHead className="w-[200px]">Título</TableHead>
          <TableHead className="w-[300px]">Última Mensagem</TableHead>
          <TableHead className="w-[100px]">Mensagens</TableHead>
          <TableHead className="w-[180px]">Criado em</TableHead>
          <TableHead className="w-[120px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticChats?.length > 0 ? (
          optimisticChats.map((chat: Chat) => (
            <TableRow key={chat.id}>
              <TableCell className="font-mono text-sm text-muted-foreground">
                <Link
                  to={`/tasks/new?chatId=${chat.id}`}
                  className="decoration-dotted underline underline-offset-4"
                >
                  {chat.id}
                </Link>
              </TableCell>
              <TableCell className="font-medium">
                {editingChatId === chat.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, chat.id)}
                      className="h-8"
                      placeholder="Digite o título do chat..."
                      autoFocus
                    />
                    <Button
                      size="icon"
                      title="Salvar"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleEditSave(chat.id)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Cancelar"
                      className="h-6 w-6"
                      onClick={handleEditCancel}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <button
                      type="button"
                      className="cursor-pointer hover:text-primary flex-1 text-left font-medium"
                      onClick={() => handleEditStart(chat)}
                      title="Clique para editar o título"
                    >
                      {chat.title || 'Sem título'}
                    </button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handleEditStart(chat)}
                      title="Editar título"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
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
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Editar chat"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => handleEditStart(chat)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Excluir chat"
                    className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                    onClick={() => handleDelete(chat.id)}
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
