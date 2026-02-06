FROM mcr.microsoft.com/devcontainers/typescript-node:20

WORKDIR /repo

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]
