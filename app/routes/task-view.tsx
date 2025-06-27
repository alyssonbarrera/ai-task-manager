import { redirect } from 'react-router'
import { TaskView } from '~/features/tasks/task-view'
import { getTaskById } from '~/queries'
import type { Route } from './+types/task-view'

export async function loader({ params }: Route.LoaderArgs) {
  const task = await getTaskById(params.id)

  if (!task) {
    return redirect('/tasks')
  }

  return { task }
}

export function HydrateFallback() {
  return <div>Loading...</div>
}

export default function TaskViewPage() {
  return <TaskView />
}
