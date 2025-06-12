# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Development

### Setup

Install the project dependencies using `npm`:

```bash
npm install
```

### Run the development server

Start the local dev server at `http://localhost:9002`:

```bash
npm run dev
```

### Run the type checker

Validate the TypeScript types:

```bash
npm run typecheck
```

## Environment Variables

Copy `env.example` to `env.local` (or configure these variables in your Vercel project) and fill in the values:

```bash
cp env.example env.local
```

The variables include your Firebase configuration and the credentials for the Firebase Admin SDK (`FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL` and `FIREBASE_ADMIN_PRIVATE_KEY`).


For a full blueprint of the application, see [docs/blueprint.md](docs/blueprint.md).

