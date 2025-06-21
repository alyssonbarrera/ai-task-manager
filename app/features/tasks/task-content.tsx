import {
  CheckSquare,
  ClipboardList,
  Lightbulb,
  TestTube2,
  Timer,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'

export function TaskContent() {
  return (
    <section className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {/* Estimated Time Card */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Timer className="h-5 w-5" />
                <CardTitle>Estimated Time</CardTitle>
              </CardHeader>
              <CardContent>2 days</CardContent>
            </Card>

            {/* Steps Card */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                <CardTitle>Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create a form component using React</li>
                  <li>Add field validation using a suitable library</li>
                  <li>Connect backend for user authentication</li>
                  <li>Persist sessions using SQLite</li>
                  <li>Test full login and logout flow</li>
                </ul>
              </CardContent>
            </Card>

            {/* Suggested Tests Card */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <TestTube2 className="h-5 w-5" />
                <CardTitle>Suggested Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>it('should render login form correctly')</li>
                  <li>it('should validate input fields')</li>
                  <li>it('should authenticate valid credentials')</li>
                  <li>it('should prevent access with invalid credentials')</li>
                </ul>
              </CardContent>
            </Card>

            {/* Acceptance Criteria Card */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                <CardTitle>Acceptance Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Login form displays properly with required fields</li>
                  <li>Invalid input is correctly flagged</li>
                  <li>Valid users can log in and maintain a session</li>
                  <li>Users are redirected upon login and logout</li>
                </ul>
              </CardContent>
            </Card>

            {/* Implementation Suggestion Card */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <CardTitle>Implementation Suggestion</CardTitle>
              </CardHeader>
              <CardContent>
                Use React Hook Form for input validation, Prisma ORM for
                managing user data, and configure protected routes using React
                Router 7.
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t flex-shrink-0">
        <div className="flex justify-end">
          <Button type="button" className="cursor-pointer">
            Salvar Task
          </Button>
        </div>
      </div>
    </section>
  )
}
