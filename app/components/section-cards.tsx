import { CheckSquare, Users } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

type SectionCardsProps = {
  usersCount: number
  tasksCount: number
}

export function SectionCards({ usersCount, tasksCount }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Usuários Criados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {usersCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Users className="size-4" />
              Últimos 6 meses
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Novos usuários registrados <Users className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Usuários cadastrados nos últimos 6 meses
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tarefas Criadas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {tasksCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <CheckSquare className="size-4" />
              Últimos 6 meses
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tarefas adicionadas <CheckSquare className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Tarefas criadas nos últimos 6 meses
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
