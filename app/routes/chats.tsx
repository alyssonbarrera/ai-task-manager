import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { ChatsList } from '~/features/chats/chats-list'
import { fetchChats } from '~/queries'

export async function loader() {
  const chats = await fetchChats()

  console.log('Chats loaded:', chats)

  return {
    chats,
  }
}

export function HydrateFallback() {
  return <div>Loading...</div>
}

export default function Chats() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Chats</CardTitle>
          <CardDescription>Confira os chats do sistema</CardDescription>
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
