# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.4 application using React 19, TypeScript, and Tailwind CSS 4. The project uses the App Router architecture (not Pages Router) and is configured to use Turbopack for faster development and build times.

## Development Commands

**Development Server:**
```bash
npm run dev
```
Starts the development server with Turbopack at http://localhost:3000. The app automatically hot-reloads on file changes.

**Production Build:**
```bash
npm run build
```
Creates an optimized production build using Turbopack.

**Start Production Server:**
```bash
npm start
```
Runs the production server. Must run `npm run build` first.

**Linting:**
```bash
npm run lint
```
Runs ESLint to check code quality. ESLint is configured with Next.js recommended rules (`next/core-web-vitals` and `next/typescript`).

## Architecture

**Next.js App Router:**
- The application uses Next.js App Router (not Pages Router)
- All routes are defined in the `src/app` directory
- `src/app/layout.tsx` is the root layout that wraps all pages
- `src/app/page.tsx` is the home page (route `/`)
- To create a new route, add a new folder with a `page.tsx` file (e.g., `src/app/about/page.tsx` creates `/about`)

**TypeScript Configuration:**
- Path alias `@/*` maps to `./src/*` for cleaner imports
- Example: `import { Component } from '@/components/Component'` instead of `../../components/Component`
- Strict mode is enabled
- Target is ES2017

**Styling:**
- Tailwind CSS 4 is configured via PostCSS
- Global styles are in `src/app/globals.css`
- The project uses Geist fonts (sans and mono variants) loaded via `next/font/google`

**Build Tool:**
- Turbopack is used for both development and production builds
- This is specified in package.json scripts with the `--turbopack` flag

## Key Files

- `next.config.ts`: Next.js configuration (currently minimal with default settings)
- `tsconfig.json`: TypeScript configuration with path aliases
- `eslint.config.mjs`: ESLint configuration using flat config format
- `src/app/layout.tsx`: Root layout with font configuration and metadata
- `src/app/page.tsx`: Home page component
