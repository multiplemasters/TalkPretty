# TalkPretty — Communication Framework Guide

A mobile-first reference for choosing and using the right communication framework for conflict, feedback, interviews, persuasion, strategy, and everyday conversations.

It runs entirely in the browser: the framework data is in `src/App.tsx`, and favorites and theme are saved in `localStorage`. There's no backend.

## Develop

Requires Node 20.19+.

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest + Testing Library
npm run typecheck
npm run build      # outputs to dist/
```

## Deploy

`.github/workflows/deploy.yml` runs typecheck, tests, and build on every push and PR. It deploys `main` to GitHub Pages at https://multiplemasters.github.io/TalkPretty/.

One-time setup: in the repo go to **Settings → Pages → Source** and pick **GitHub Actions**.

## Other files

`communication_frameworks_handbook.html` is the earlier standalone single-file handbook (17 frameworks). The build doesn't include it.

## Stack

React 19, Vite 7, Tailwind CSS 4, lucide-react, Vitest.
