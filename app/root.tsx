import '@copilotkit/react-ui/styles.css'
import './app.css'

import { CopilotKit } from '@copilotkit/react-core'
import {
  type CopilotKitCSSProperties,
  CopilotSidebar,
} from '@copilotkit/react-ui'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import type { Route } from './+types/root'
import { Toaster } from './components/ui/sonner'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function meta(_params: Route.MetaArgs) {
  return [
    { title: 'AI Task Manager' },
    {
      name: 'description',
      content:
        'An AI-powered task manager to help you stay organized and productive.',
    },
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        style={
          {
            '--copilot-kit-primary-color': 'oklch(0.985 0 0)',
            '--copilot-kit-background-color': 'oklch(0.21 0.006 285.885)',
            '--copilot-kit-text-color': 'oklch(0.985 0 0)',
            '--copilot-kit-secondary-color': 'oklch(0.21 0.006 285.885)',
            '--copilot-kit-secondary-text-color': 'oklch(0.985 0 0)',
            '--copilot-kit-secondary-contrast-color': 'oklch(0.985 0 0)',
            '--copilot-kit-input-background-color': 'oklch(0.21 0.006 285.885)',
            '--copilot-kit-contrast-color': 'oklch(0.21 0.006 285.885)',
            '--copilot-kit-dev-console-bg': 'oklch(0.21 0.006 285.885)',
            '--copilot-kit-dev-console-text-': 'oklch(0.985 0 0)',
          } as CopilotKitCSSProperties
        }
      >
        <CopilotKit runtimeUrl="/copilotkit">
          <CopilotSidebar
            labels={{
              title: 'Assitente de Tarefas',
              initial: 'Faça uma pergunta sobre as tarefas',
            }}
          >
            {children}
            <ScrollRestoration />
            <Scripts />
            <Toaster position="top-right" />
          </CopilotSidebar>
        </CopilotKit>
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
