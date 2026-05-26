# LaTeX Workshop

This folder contains the frontend catalog for resume PDF templates and filters.

To add a new user-facing template:

1. Add the template metadata to `options.ts`.
2. Add the matching `templateId` to `server/src/resume/dto/render-resume.dto.ts`.
3. Add render settings or a dedicated renderer branch in `server/src/resume/latex/latex-renderer.service.ts`.

The default template is `akhmad-classic`. It is intentionally generic enough for other users to reuse: profile fields and AI-tailored resume content are injected dynamically before `pdflatex` compilation.
