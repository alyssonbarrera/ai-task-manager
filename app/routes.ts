import {
  index,
  layout,
  type RouteConfig,
  route,
} from '@react-router/dev/routes'

export default [
  layout('layouts/layout.tsx', [
    index('routes/dashboard.tsx'),
    route('tasks', 'routes/tasks.tsx'),
    route('users', 'routes/users.tsx'),
    route('chats', 'routes/chats.tsx'),
    route('tasks/new', 'routes/task-new.tsx'),
    route('tasks/edit/:id', 'routes/task-edit.tsx'),
  ]),
  route('api/chat', 'routes/api.chat.ts'),
] satisfies RouteConfig
