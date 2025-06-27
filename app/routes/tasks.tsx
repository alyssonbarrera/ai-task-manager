import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { TasksList } from '~/features/tasks/tasks-list'
import { deleteTask, fetchTasks } from '~/queries'
import type { Route } from './+types/tasks'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const action = formData.get('_action') as string
  const taskId = formData.get('taskId') as string

  if (!taskId) {
    return { success: false, error: 'Task ID é obrigatório' }
  }

  try {
    switch (action) {
      case 'deleteTask': {
        await deleteTask(taskId)
        return { success: true, action: 'deleteTask' }
      }

      default:
        return { success: false, error: 'Ação não reconhecida' }
    }
  } catch (error) {
    console.error('Erro na ação da task:', error)
    return {
      success: false,
      error: 'Erro ao excluir task',
    }
  }
}

export async function loader() {
  const tasks = await fetchTasks()

  return {
    tasks,
  }
}

export function HydrateFallback() {
  return <div>Loading...</div>
}

export default function Tasks() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tarefas</CardTitle>
          <CardDescription>Confira as tarefas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <TasksList />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
