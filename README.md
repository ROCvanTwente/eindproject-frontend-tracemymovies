# TraceMyMovies

Frontend for the TraceMyMovies project.

Production website: [www.tracemymovies.com](https://www.tracemymovies.com)

## Prerequisites

- Node.js 20+
- npm 10+

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev -- --host
```

3. Open the app in your browser:

- Local: [http://localhost:5173](http://localhost:5173)

## Build for production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Notes

- The app currently supports mock/demo behavior for some data and auth flows.
- TMDB integration falls back to mock data when no API key is configured in [src/app/services/tmdb.ts](src/app/services/tmdb.ts).
- Demo login accounts (from the mock auth service):
	- admin@tracemymovies.com / demo123
	- demo@tracemymovies.com / demo123