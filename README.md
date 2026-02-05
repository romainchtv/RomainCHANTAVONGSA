# Monorepo Portfolio (Web + Mobile)

This repo is a pnpm + Turborepo monorepo for a Next.js web portfolio and an Expo mobile app.

## Structure
- apps/web (Next.js)
- apps/mobile (Expo React Native)
- packages/ui (shared components)
- packages/theme (design tokens)
- packages/content (shared types/data)

## Setup
1. Install Node.js (LTS) and pnpm
2. Install deps at the root:
   pnpm install

## Dev
- Web: pnpm --filter web dev
- Mobile: pnpm --filter mobile start

## Build
- Web: pnpm --filter web build

## Docker (Web)
- Build + run: docker compose up --build
- Web will be available on http://localhost:3000

## Notes
- .npmrc uses node-linker=hoisted (Expo + Next monorepo compatibility)
- Next.js is configured to transpile workspace packages
- Expo Metro is configured to watch packages/*
