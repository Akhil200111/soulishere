# Project Coding and Architectural Rules

> **IMPORTANT**: This project strictly uses JavaScript (`.js` / `.jsx`). **Do NOT convert files to `.ts` or `.tsx`**, and do NOT introduce TypeScript unless explicitly requested by the user.

1. **Keep Code Simple & Readable**: Prioritize readability > cleverness, maintainability > short code, reusability > duplication.
2. **Keep Main Files Simple**: Main page components coordinate smaller modular components in `components/`, logic in `utils/` and `services/`.
3. **Reusable Components**: Extract UI into dedicated components when meaningful or reused (`Button.js`, `TributeCard.js`).
4. **Simple API Routes**: Next.js API routes (`route.js`) focus only on HTTP request handling, input validation, calling services, and returning clean responses.
5. **Separate Utility Files**: Group related utility helpers into focused files (`utils/date.js`, `utils/validation.js`, `utils/familyTreeLayout.js`).
6. **Separate Business Logic**: Domain logic lives in `services/` or `lib/`, keeping UI components clean.
7. **Separate Database Operations**: Route → Service → Database (Mongoose/Prisma). Never query DB directly in components.
8. **Custom Hooks**: Extract complex or shared state/fetching logic into hooks under `hooks/`.
9. **API Client Functions**: Reusable API helper functions in `lib/api/` instead of repeated inline `fetch()` calls.
10. **Avoid Duplication**: Search existing project components, utils, and hooks before writing new code.
11. **Keep Files Focused**: Split files when doing so improves readability and maintainability.
12. **Meaningful Comments**: Explain *why* something is done, not what obvious code syntax does.
13. **Clean Error Handling**: Never expose database errors or stack traces to end-users.
14. **Centralized Validation**: Avoid duplicate validation rules across routes/components.
15. **Descriptive Naming**: Use clear, descriptive names for functions and components (`createTribute()`, `TributeCard.js`).
16. **No Over-Engineering**: Avoid unnecessary classes, state management libraries, or complex patterns.
17. **Follow Existing Structure**: Stick strictly to `src/app/`, `src/components/`, `src/lib/`, `src/utils/`, `src/services/`.
18. **Pre-Implementation Process**: Inspect → Plan → Reuse → Keep main files simple → Implement → Verify.
19. **JavaScript Only**: `.js` / `.jsx` only. Do not convert to TypeScript.
20. **Code Quality Review**: Verify simplicity, modularity, and consistency before marking tasks complete.
