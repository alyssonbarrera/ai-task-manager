import { ChatInterface } from '~/components/chat-interface'
import { TaskContent } from './task-content'

export function TasksChatBot() {
  return (
    <div className="grid grid-cols-2 grid-rows-1 h-[calc(100dvh-7.25rem)] gap-6">
      <ChatInterface />
      <TaskContent />
    </div>
  )
}
