@AGENTS.md

# Project: Jackie Wong (portfolio_v3)

Next.js 15 frontend engineer portfolio application with App Router.

## Code Style

- TypeScript strict mode
- Use practical and easy-to-maintain variable names
- Use `const`all the time, only use `let` if mutability is needed
- CSS: Tailwind utility classes, no custom CSS files, refer to `global.css` for Tailwind configuration and theme

## Commands

- `npm run dev`: Start development server (port 3000)
- `npm run test`: Run Jest tests
- `npm run test:e2e`: Run Playwright end-to-end tests
- `npm run lint`: ESLint check

## Architecture

- `/app`: Next.js App Router pages and layouts
- `/app/components/sections`: Main components for each section of the website
- `/app/components/common`: Reusable UI components
- `/data/project.ts`: List of projects
- `/app/featured_project`: Featured projects route
- `/global.css`: Tailwind CSS configuration and theme

## Important Notes

- NEVER commit .env files
- If unsure about result, refer to uploaded `portfolio-redesign-blueprint.md` file in chat
