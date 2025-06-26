import {
  CheckSquare,
  ClipboardList,
  Lightbulb,
  TestTube2,
  Timer,
} from 'lucide-react'
import { Fragment } from 'react'
import { useLoaderData } from 'react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import type { loader } from '~/routes/task-new'

export function TaskContent() {
  const { task } = useLoaderData<typeof loader>()

  if (!task?.title) {
    return <Fragment />
  }

  return (
    <section className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Timer className="h-5 w-5" />
                <CardTitle>Título</CardTitle>
              </CardHeader>
              <CardContent>{task?.title}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Timer className="h-5 w-5" />
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>{task?.description}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Timer className="h-5 w-5" />
                <CardTitle>Tempo estimado</CardTitle>
              </CardHeader>
              <CardContent>{task?.estimatedTime}</CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                <CardTitle>Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {task?.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <TestTube2 className="h-5 w-5" />
                <CardTitle>Testes sugeridos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {task?.suggestedTests.map((test, index) => (
                    <li key={index}>{test}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                <CardTitle>Critérios de aceite</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {task?.acceptanceCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <CardTitle>Sugestão de implementação</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{task?.implementationSuggestion}</p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      <div className="px-4 pt-4 border-t flex-shrink-0">
        <div className="flex justify-end">
          <Button type="button" className="cursor-pointer">
            Salvar Task
          </Button>
        </div>
      </div>
    </section>
  )
}
