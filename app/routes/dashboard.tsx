import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { ChatsList } from '~/features/chats/chats-list'
import { TasksList } from '~/features/tasks/tasks-list'
import { countTasks, fetchChats, fetchTasks } from '~/queries'
import type { Route } from './+types/dashboard'

export async function loader() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const [tasksCount, tasks, chats] = await Promise.all([
    countTasks(sixMonthsAgo),
    fetchTasks(),
    fetchChats(),
  ])

  return {
    tasks,
    chats,
    tasksCount,
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tarefas</CardTitle>
          <CardDescription>Lista de todas as tarefas criadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <TasksList />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chats</CardTitle>
          <CardDescription>Lista de todos os chats</CardDescription>
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
