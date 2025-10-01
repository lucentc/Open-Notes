Open Notes

Open Notes is a lightweight, realtime note-taking web app built with Next.js, React 19, Tailwind CSS and Supabase for storage and realtime updates. It provides a simple UI to create, edit, and delete notes with realtime syncing via Supabase Realtime.

## Features

- Create, edit, and delete notes
- Realtime updates using Supabase Realtime (insert/update/delete)
- Simple, responsive UI built with Tailwind CSS
- Internationalization (i18n) support

## Tech Stack

- Next.js 15 (app router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase (database + realtime)
- Lucide icons

## Getting started

Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- A Supabase project (to provide the database and anon key)

Install dependencies

```powershell
npm install
```

Run the development server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment variables

This project expects Supabase environment variables to be provided at build/runtime.

- NEXT_PUBLIC_SUPABASE_URL — your Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY — your Supabase anon/public key

Create a `.env.local` file at the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...your_anon_key...
```

Important: Keep your service_role key out of frontend code. This project uses the anon/public key on the client.

## Project structure (high level)

- `src/app` — Next.js app router pages and global styles
- `src/components` — UI components (Note list, editor, modal)
- `src/hooks` — React hooks (including `useNotes` for Supabase operations)
- `src/lib/supabaseClient.ts` — Supabase client initialization (reads env vars)
- `src/config` — constants such as table names
- `src/types` — TypeScript types (Note model)

## Supabase schema (expected)

The app assumes a `notes` table with at least the following columns:

- id (uuid or text primary key)
- content (text)
- color_tag (text)
- created_at (timestamp)
- updated_at (timestamp)

If you use the Supabase UI, create a table named `notes` (or update `src/config/constants.ts` to match your table name).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — run production build
- `npm run lint` — run ESLint
- `npm run tailwind:init` — generate Tailwind config files

## Notes on realtime

The client subscribes to postgres_changes on the `notes` table and updates local state on INSERT / UPDATE / DELETE events. The Supabase client is configured in `src/lib/supabaseClient.ts` and expects the public URL and anon key as environment variables.

## Contributing

1. Fork the repo and create a feature branch
2. Run the app locally and make changes
3. Open a PR with a clear description of the change

## Troubleshooting

- Missing Supabase env vars will throw an error on startup — verify `.env.local` values.
- If realtime events don't appear, ensure the Supabase Realtime feature is enabled for the project and the table has replication enabled.

## License

This project is provided as-is. Add your preferred license in `LICENSE` if you intend to open-source it.

---

If you'd like, I can also:

- Add a small CONTRIBUTING.md with development notes
- Add a sample SQL migration for the `notes` table
- Add GitHub Actions for linting and preview deployments

Let me know which you'd prefer.
