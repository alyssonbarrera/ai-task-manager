import { Form, useActionData } from 'react-router'

import { Button } from '~/components/ui/button'

export async function action() {
  await new Promise(resolve => setTimeout(resolve, 2000))

  return { success: true, timestamp: new Date().toISOString() }
}

export default function () {
  const data = useActionData<typeof action>()

  console.log(data)

  return (
    <Form method="POST">
      <Button type="submit">Clicar repetidamente!</Button>
    </Form>
  )
}
