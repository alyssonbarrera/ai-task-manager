import { SectionCards } from '~/components/section-cards'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { ChatsList } from '~/features/chats/chats-list'
import { TasksList } from '~/features/tasks/tasks-list'
import { UsersList } from '~/features/users/users-list'
import {
  countTasks,
  countUsers,
  fetchChats,
  fetchTasks,
  fetchUsers,
} from '~/queries'
import type { Route } from './+types/dashboard'

export async function loader() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const [usersCount, tasksCount, users, tasks, chats] = await Promise.all([
    countUsers(sixMonthsAgo),
    countTasks(sixMonthsAgo),
    fetchUsers(),
    fetchTasks(),
    fetchChats(),
  ])

  return {
    users,
    tasks,
    chats,
    usersCount,
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
      <SectionCards
        usersCount={loaderData.usersCount}
        tasksCount={loaderData.tasksCount}
      />

      <div className="flex flex-col gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>
              Lista de todos os usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <UsersList />
            </div>
          </CardContent>
        </Card>

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
    </div>
  )
}
