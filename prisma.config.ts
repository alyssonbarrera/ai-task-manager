import path from 'node:path'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { defineConfig } from 'prisma/config'

import 'dotenv/config'

type Env = {
  TURSO_DATABASE_URL: string
  TURSO_AUTH_TOKEN: string
}

export default defineConfig<Env>({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),

  migrate: {
    async adapter(env) {
      return new PrismaLibSQL({
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN,
      })
    },
  },
})
