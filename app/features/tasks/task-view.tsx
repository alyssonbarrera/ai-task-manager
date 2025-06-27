import {
  Bug,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Target,
} from 'lucide-react'
import { useLoaderData } from 'react-router'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import type { loader } from '~/routes/task-view'

const parseJsonArray = (jsonString: string | null) => {
  if (!jsonString) return []
  try {
    return JSON.parse(jsonString)
  } catch {
    return []
  }
}

export function TaskView() {
  const { task } = useLoaderData<typeof loader>()

  const steps = parseJsonArray(task.steps)
  const acceptanceCriteria = parseJsonArray(task.acceptanceCriteria)
  const suggestedTests = parseJsonArray(task.suggestedTests)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Criado em {formatDate(task.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Atualizado em {formatDate(task.updatedAt)}
            </div>
          </div>
        </div>

        {/* Estimated Time Badge */}
        <div>
          <Badge variant="secondary" className="text-sm">
            <Clock className="h-3 w-3" />
            Tempo estimado: {task.estimatedTime}
          </Badge>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Descrição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{task.description}</p>
          </CardContent>
        </Card>

        {/* Implementation Suggestion */}
        {task.implementationSuggestion && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Sugestão de Implementação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {task.implementationSuggestion}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Passos de Implementação
              </CardTitle>
              <CardDescription>
                {steps.length} {steps.length === 1 ? 'passo' : 'passos'} para
                completar esta tarefa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {steps.map((step: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <Badge variant="outline" className="flex-shrink-0 h-6">
                      {index + 1}
                    </Badge>
                    <span className="text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Acceptance Criteria */}
        {acceptanceCriteria.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Critérios de Aceitação
              </CardTitle>
              <CardDescription>
                Requisitos que devem ser atendidos para considerar a tarefa
                completa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {acceptanceCriteria.map((criteria: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Suggested Tests */}
        {suggestedTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Testes Sugeridos
              </CardTitle>
              <CardDescription>
                Testes recomendados para validar a implementação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestedTests.map((test: string, index: number) => (
                  <div key={index} className="bg-muted rounded-lg p-3">
                    <code className="text-sm font-mono">{test}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
