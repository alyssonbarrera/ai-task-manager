import { redirect } from 'react-router'
import { TaskForm } from '~/features/tasks/task-form'
import { getTaskById, updateTask } from '~/queries'
import { storeTaskAsEmbeddings } from '~/services/task.server'
import type { Route } from './+types/task-edit'

const prepareListData = (str: string) =>
  JSON.stringify(str ? str.split('\n').filter(Boolean) : [])

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()

  const taskId = formData.get('task_id') as string
  formData.delete('task_id')

  try {
    const taskData = {
      chatMessageId: null,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      estimatedTime: formData.get('estimated_time') as string,
      steps: prepareListData(formData.get('steps') as string),
      suggestedTests: prepareListData(
        formData.get('suggested_tests') as string
      ),
      acceptanceCriteria: prepareListData(
        formData.get('acceptance_criteria') as string
      ),
      implementationSuggestion: formData.get(
        'implementation_suggestion'
      ) as string,
    }

    await updateTask({
      id: taskId,
      data: taskData,
    })

    await storeTaskAsEmbeddings(taskId, taskData)

    return { success: true }
  } catch (error) {
    console.log(error)

    return { success: false }
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  const task = await getTaskById(params.id)

  if (!task) {
    return redirect('/tasks')
  }

  return { task }
}

export default function TaskEdit() {
  return <TaskForm />
}
