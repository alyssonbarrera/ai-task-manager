import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { UsersList } from '~/features/users/users-list'
import { fetchUsers } from '~/queries'

export async function loader() {
  const users = await fetchUsers()

  return {
    users,
  }
}

export function HydrateFallback() {
  return <div>Loading...</div>
}

export default function Users() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Confira os usuários do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <UsersList />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
