# Resume AI Generator & Autofill Extension

AI-powered resume workspace for tailoring CV content to job descriptions, previewing a LaTeX PDF, and downloading the final resume.

## Features

- Claude-powered resume tailoring
- Editable candidate profile and job description
- Workshop with template/filter selection
- PDF preview and download
- Browser extension autofill simulator
- NestJS backend + React/Vite frontend

## Tech Stack

- React 19, Vite, TypeScript
- Zustand
- NestJS
- Claude API via `@anthropic-ai/sdk`
- LaTeX PDF rendering via `xelatex`

## Setup

```bash
npm install
```

Create `.env`:

```env
ANTHROPIC_API_KEY="your_claude_api_key"
```

Run locally:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3001`

## Scripts

```bash
npm run dev      # start frontend + backend
npm run build    # production build
npm run lint     # TypeScript check
```

## Notes

- Keep API keys only in `.env`.
- PDF generation requires a local LaTeX installation with `xelatex`.
- Default PDF template is the FAANG-style ATS-friendly resume in the Workshop.
