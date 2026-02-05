FROM node:20-alpine

WORKDIR /repo

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]