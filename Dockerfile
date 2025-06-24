FROM node:22-slim AS development-dependencies-env

RUN apt-get update -y && apt-get install -y openssl ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

COPY . /app
WORKDIR /app

RUN pnpm install

RUN pnpm dlx prisma generate


FROM node:22-slim AS production-dependencies-env

RUN apt-get update -y && apt-get install -y openssl ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

COPY ./package.json pnpm-lock.yaml /app/
COPY ./prisma /app/prisma
WORKDIR /app

RUN pnpm install --prod

RUN pnpm dlx prisma generate


FROM node:22-slim AS build-env

RUN apt-get update -y && apt-get install -y openssl ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

COPY . /app/

COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

RUN pnpm build


FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

COPY ./package.json pnpm-lock.yaml /app/
COPY ./prisma /app/prisma

COPY --from=production-dependencies-env /app/node_modules /app/node_modules

COPY --from=build-env /app/build /app/build
WORKDIR /app

RUN pnpm dlx prisma generate