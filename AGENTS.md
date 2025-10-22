# Repository Guidelines

## Project Structure & Module Organization
The app is a Vite + React TypeScript client. UI entry point `src/main.tsx` mounts routes defined under `src/pages`. Shared UI atoms and composites live in `src/components`; keep cross-cutting logic in `src/hooks` and `src/lib`. Domain constants are centralized in `src/constants`. Static assets (icons, fonts, JSON) belong in `src/assets`; static public files belong in `public`. Tailwind configuration sits in `tailwind.config.ts`, and Vite settings in `vite.config.ts`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (lockfile synced); `npm install` also works when necessary. Run `pnpm dev` for the hot-reloading dev server on `localhost:5173`. Use `pnpm build` for optimized production output in `dist/`, and `pnpm build:dev` to simulate production with development env vars. Serve a built bundle locally via `pnpm preview`. Lint all TypeScript and JSX with `pnpm lint`.

## Coding Style & Naming Conventions
This codebase uses TypeScript, React 18, and Tailwind CSS. Favor functional components and hooks. Name components in PascalCase (e.g., `WalletStatusCard.tsx`), hooks in `useThing` camelCase, and utility modules in `kebab-case`. Maintain two-space indentation and limit lines to 100 characters. Keep Tailwind class lists sorted by layout → spacing → color for clarity. Run ESLint (`pnpm lint`) before pushing; extend rules in `eslint.config.js` when introducing new patterns.

## Testing Guidelines
Automated tests are not yet configured. When introducing tests, colocate them near the feature (e.g., `src/components/__tests__/Component.test.tsx`) and favor Vitest + Testing Library for React behavior. Document any manual verification steps in the PR description until a test runner is added.

## Commit & Pull Request Guidelines
Use descriptive, present-tense commit messages (`feat: add wallet connect flow`, `fix: guard null session`). Group related changes per commit. For pull requests, include a concise summary, motivation, and screenshots or screen recordings for UI changes. Link to tracking issues and highlight follow-up tasks. Ensure the branch builds (`pnpm build`) and linting passes before requesting review.
