import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useFetcher, useLoaderData } from 'react-router'
import { MarkdownMessage } from '~/components/markdown-message'
import { Avatar } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import type { ChatMessage } from '~/generated/prisma/client'

import { cn } from '~/lib/utils'
import type { loader } from '~/routes/task-new'

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetcher = useFetcher()
  const isLoading = fetcher.state !== 'idle'

  const { chatId, messages } = useLoaderData<typeof loader>()

  const [localMessages, setLocalMessages] =
    useState<({ pending?: boolean } & ChatMessage)[]>(messages)
  const [inputValue, setInputValue] = useState('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const value = inputValue.trim()
    if (!value) return

    const date = new Date()
    const now = Date.now()

    const optimisticMessage: ChatMessage & { pending: boolean } = {
      role: 'user',
      pending: true,
      content: value,
      updatedAt: date,
      createdAt: date,
      chatId: chatId ?? '',
      id: `optimistic-${now}`,
    }

    setLocalMessages(prev => [...prev, optimisticMessage])
    setInputValue('')

    inputRef.current?.focus()

    fetcher.submit(
      { chatId: chatId ?? '', message: value },
      { method: 'POST', action: '/api/chat' }
    )
  }

  useEffect(() => {
    scrollToBottom()
  }, [localMessages])

  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  return (
    <Card className="flex flex-col h-full w-full border shadow-sm overflow-hidden">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {localMessages.map(message => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                  message.pending && 'opacity-50'
                )}
              >
                <div
                  className={cn(
                    'flex gap-3 max-w-[80%]',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <div
                      className={cn(
                        'flex h-full w-full items-center justify-center rounded-full',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {message.role === 'user' ? 'U' : 'A'}
                    </div>
                  </Avatar>
                  <div
                    className={cn(
                      'rounded-lg p-3',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <MarkdownMessage
                        content={message.content}
                        className="text-sm break-words"
                      />
                    ) : (
                      <p className="text-sm break-words">{message.content}</p>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground">
                      A
                    </div>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            name="message"
            placeholder="Descreva a tarefa..."
            className="flex-1"
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            autoComplete="off"
          />

          <Button
            size="icon"
            type="submit"
            disabled={isLoading}
            className="cursor-pointer"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
