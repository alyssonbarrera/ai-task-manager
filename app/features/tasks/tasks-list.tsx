import { MessageCircle, Pencil, Trash2 } from 'lucide-react'
import { startTransition, useOptimistic } from 'react'
import { Link, useFetcher, useLoaderData } from 'react-router'

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

type OptimisticUpdate = {
  type: 'delete'
  id: string
}

export function TasksList() {
  const { tasks } = useLoaderData<typeof loader>()
  const fetcherDelete = useFetcher()

  const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
    tasks,
    (currentTasks: typeof tasks, optimisticUpdate: OptimisticUpdate) => {
      if (optimisticUpdate.type === 'delete') {
        return currentTasks.filter(task => task.id !== optimisticUpdate.id)
      }
      return currentTasks
    }
  )

  const handleDelete = (taskId: string) => {
    updateOptimisticTasks({ type: 'delete', id: taskId })

    startTransition(async () => {
      await fetcherDelete.submit(
        { taskId, _action: 'deleteTask' },
        { method: 'POST', action: '/tasks' }
      )
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Título</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead className="w-[150px]">Data de Criação</TableHead>
          <TableHead className="w-[100px]">Estimativa</TableHead>
          <TableHead className="w-[120px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticTasks.map(task => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">
              <Link
                to={`/tasks/${task.id}`}
                className="decoration-dotted underline underline-offset-4"
              >
                {task.title}
              </Link>
            </TableCell>
            <TableCell className="w-[400px] max-w-[400px] truncate text-ellipsis overflow-hidden">
              {task.description}
            </TableCell>
            <TableCell>
              {new Date(task.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>{task.estimatedTime}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  title="Chat"
                  variant="ghost"
                  className="size-8"
                  disabled={!task.chatMessageId}
                >
                  <Link to={`/tasks/new?chat=${task.chatMessage?.chatId}`}>
                    <MessageCircle className="size-4" />
                  </Link>
                </Button>
                <Link to={`/tasks/edit/${task.id}`}>
                  <Pencil className="size-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                  title="Delete task"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
