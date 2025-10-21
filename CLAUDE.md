# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **showcase example** of a modern Next.js application demonstrating best practices for the following technology stack:

- **Next.js 15.5.4** with App Router architecture
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library (New York style variant)
- **Turbopack** for fast development and builds
- **Lucide React** for icons

The project demonstrates a full-stack implementation with client-side React components, Next.js API routes, and in-memory data storage. While the example implements a todo list application, the patterns and architecture can be applied to any type of application.

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

## Project Structure

```
my-app/
├── src/
│   ├── app/                      # Next.js App Router pages and layouts
│   │   ├── api/                  # Next.js API routes (backend endpoints)
│   │   │   └── lists/            # Example: /api/lists endpoints
│   │   │       ├── route.ts      # GET /api/lists, POST /api/lists
│   │   │       └── [id]/         # Dynamic route: /api/lists/:id
│   │   │           ├── route.ts  # GET, PATCH, DELETE /api/lists/:id
│   │   │           └── todos/    # Nested resource routes
│   │   │               ├── route.ts
│   │   │               └── [todoId]/
│   │   │                   └── route.ts
│   │   ├── lists/                # Frontend pages
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Dynamic route page: /lists/:id
│   │   ├── layout.tsx            # Root layout (fonts, metadata, global wrapper)
│   │   ├── page.tsx              # Home page: /
│   │   ├── globals.css           # Global styles + Tailwind + shadcn theme
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── input.tsx
│   │   └── sidebar.tsx           # Custom components
│   └── lib/
│       ├── utils.ts              # Utility functions (cn helper for Tailwind)
│       ├── todoStore.ts          # Data store/state management
│       └── listStore.ts
├── components.json               # shadcn/ui configuration
├── tsconfig.json                 # TypeScript config with path aliases
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.ts                # Next.js configuration
└── package.json
```

## Architecture Patterns

### 1. Next.js App Router

**Directory-based routing:** Routes are defined by the folder structure in `src/app/`. Each route folder contains a `page.tsx` file.

- `src/app/page.tsx` → `/` (home page)
- `src/app/lists/[id]/page.tsx` → `/lists/:id` (dynamic route)
- `src/app/about/page.tsx` → `/about` (example)

**Layouts:** The `layout.tsx` file wraps all pages in a route segment. The root layout (`src/app/layout.tsx`) wraps the entire application.

### 2. API Routes (Backend)

**Location:** All API routes live in `src/app/api/`. Next.js automatically exposes these as HTTP endpoints.

**File naming:**
- `route.ts` - Defines HTTP method handlers (GET, POST, PATCH, DELETE, etc.)
- `[id]/` - Dynamic route segments (e.g., `/api/lists/123`)

**Example API route structure:**
```typescript
// src/app/api/lists/route.ts
import { NextResponse } from 'next/server';

// GET /api/lists
export async function GET() {
  const data = []; // fetch from store/database
  return NextResponse.json(data);
}

// POST /api/lists
export async function POST(request: Request) {
  const body = await request.json();
  // process and save data
  return NextResponse.json(result, { status: 201 });
}
```

**Dynamic routes:**
```typescript
// src/app/api/lists/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const listId = params.id;
  // fetch by ID
  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  // update resource
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // delete resource
  return NextResponse.json({ success: true });
}
```

**Nested resources:** API routes can be nested to represent resource relationships:
```
/api/lists/:id/todos        → List all todos for a list
/api/lists/:id/todos/:todoId → Operate on a specific todo
```

### 3. Client Components

**'use client' directive:** Pages that use React hooks, browser APIs, or interactivity must include `'use client'` at the top:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MyPage() {
  const [data, setData] = useState([]);
  // ... component logic
}
```

**Fetching data from API routes:**
```typescript
const fetchData = async () => {
  const res = await fetch('/api/lists');
  if (res.ok) {
    const data = await res.json();
    setData(data);
  }
};

useEffect(() => {
  fetchData();
}, []);
```

**Dynamic routes:** Use `useParams()` to access dynamic route parameters:
```typescript
import { useParams } from 'next/navigation';

export default function DetailPage() {
  const params = useParams();
  const id = params.id as string; // matches [id] in folder name
}
```

### 4. shadcn/ui Components

**Installation:** Components are installed individually using the shadcn CLI:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

**Location:** All shadcn components are placed in `src/components/ui/` and can be customized as needed.

**Configuration:** The project uses:
- Style: `new-york` variant
- Base color: `neutral`
- Icons: `lucide-react`
- CSS variables: enabled for theming

**Import pattern:**
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
```

**Customization:** shadcn components are copied into your project, so you can freely modify them. They use:
- `class-variance-authority` (cva) for variant styling
- `@radix-ui` primitives for accessibility
- Tailwind CSS for styling

### 5. Styling with Tailwind CSS 4

**Global styles:** Located in `src/app/globals.css` using the new Tailwind 4 syntax:
```css
@import "tailwindcss";

@theme inline {
  --color-primary: ...;
  --radius-lg: var(--radius);
}
```

**CSS variables:** The project uses CSS variables for theming (colors, radii) defined in `globals.css`. These integrate with Tailwind's color palette.

**Dark mode:** Configured with a custom variant:
```css
@custom-variant dark (&:is(.dark *));
```

**Utility helper:** The `cn()` utility from `src/lib/utils.ts` merges Tailwind classes safely:
```typescript
import { cn } from '@/lib/utils';

<div className={cn("base-class", condition && "conditional-class", className)} />
```

### 6. Data Management Pattern

**Production approach:** Most applications should use a proper database like PostgreSQL with an ORM like Prisma or Drizzle. API routes would then import the database client and query directly.

**In-memory stores (demo/development only):** This example project uses in-memory stores for simplicity. If you need in-memory state, always use the globalThis singleton pattern to survive Next.js hot reloads:

```typescript
// src/lib/todoStore.ts
class TodoStore {
  private todos: Map<string, Todo> = new Map();
  // CRUD methods...
}

// Singleton pattern for Next.js hot reload
const globalForTodoStore = globalThis as unknown as {
  todoStore: TodoStore | undefined;
};

if (!globalForTodoStore.todoStore) {
  globalForTodoStore.todoStore = new TodoStore();
}

export const todoStore = globalForTodoStore.todoStore;
```

**API integration:** API routes import and use the data source:
```typescript
import { todoStore } from '@/lib/todoStore';

export async function GET() {
  const todos = todoStore.getAll();
  return NextResponse.json(todos);
}
```

### 7. TypeScript Configuration

**Path aliases:** Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage:**
```typescript
// ✅ Use path aliases
import { Button } from '@/components/ui/button';
import { todoStore } from '@/lib/todoStore';

// ❌ Avoid relative imports
import { Button } from '../../components/ui/button';
```

**Interface definitions:** Define TypeScript interfaces for data models, typically co-located with the store or API route:
```typescript
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}
```

### 8. Component Patterns

**Page components:**
- Export a default function component
- Use `'use client'` if interactivity is needed
- Follow the naming convention `export default function PageName()`

**UI composition:**
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ExamplePage() {
  return (
    <div className="min-h-screen p-8">
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Icons:** Use Lucide React icons:
```typescript
import { Trash2, Edit2, Plus } from 'lucide-react';

<Button>
  <Plus className="h-4 w-4" />
  Add Item
</Button>
```

## Adding New Features

### Adding a New Page

1. Create a folder in `src/app/` with the route name
2. Add a `page.tsx` file inside
3. For dynamic routes, use `[param]` folder naming

Example: `/products/[id]` page:
```typescript
// src/app/products/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  return <div>Product: {productId}</div>;
}
```

### Adding a New API Endpoint

1. Create the route structure in `src/app/api/`
2. Add a `route.ts` file
3. Export HTTP method handlers

Example: `/api/products` endpoint:
```typescript
// src/app/api/products/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(body, { status: 201 });
}
```

### Adding a shadcn Component

1. Run: `npx shadcn@latest add [component-name]`
2. The component is added to `src/components/ui/`
3. Import and use it with the `@/` alias

Example:
```bash
npx shadcn@latest add badge
```
```typescript
import { Badge } from '@/components/ui/badge';
```

### Connecting a Database

**Recommended approach:** Use PostgreSQL with Prisma or Drizzle:
1. Install Prisma: `npm install prisma @prisma/client`
2. Initialize: `npx prisma init`
3. Define your schema in `prisma/schema.prisma`
4. Run migrations: `npx prisma migrate dev`
5. Import and use in API routes: `import { prisma } from '@/lib/prisma'`

**If using in-memory storage (demo only):** Follow the globalThis singleton pattern shown in `todoStore.ts` to survive Next.js hot reloads.

### Adding Custom Components

1. Create `.tsx` files in `src/components/` (not in `ui/`)
2. Use path aliases for imports
3. Compose with shadcn components

Example:
```typescript
// src/components/product-card.tsx
import { Card } from '@/components/ui/card';

export function ProductCard({ title }: { title: string }) {
  return <Card>{title}</Card>;
}
```

## Best Practices

1. **Always use path aliases (`@/*`)** for imports
2. **Use 'use client' sparingly** - only add when hooks/interactivity are needed
3. **Keep API routes thin** - delegate business logic to lib/ modules
4. **Define TypeScript interfaces** for all data structures
5. **Use shadcn components** as a starting point, customize as needed
6. **Follow the cn() pattern** for conditional className merging
7. **Organize by feature** - keep related files close together
8. **Use proper HTTP status codes** in API responses
9. **Handle errors gracefully** with try/catch and proper error responses
10. **Use semantic HTML and ARIA attributes** (shadcn components include these)

## Key Dependencies

- **next** (15.5.4) - Framework
- **react** (19) - UI library
- **typescript** (5) - Type safety
- **tailwindcss** (4) - Styling
- **@radix-ui/*** - Headless UI primitives used by shadcn
- **lucide-react** - Icon library
- **class-variance-authority** - Variant styling for components
- **clsx** + **tailwind-merge** - Conditional className utilities

## Notes for Claude Code

- When adding features, follow the existing patterns for consistency
- Use the path alias `@/*` for all imports from `src/`
- Check `components.json` to see which shadcn components are already installed
- API routes are server-side and can directly import and use data sources
- Client components fetch data from API routes (not directly from stores)
- The todo/list example is just for demonstration - the patterns apply to any domain
- For production apps, use PostgreSQL with Prisma or Drizzle instead of in-memory stores
- If using in-memory state, always use the globalThis singleton pattern
