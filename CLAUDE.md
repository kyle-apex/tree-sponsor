# Tree Sponsor Codebase Guide

## Build/Test Commands

- `npm run server` - Start development server
- `npm run build` - Build the project
- `npm run lint` - Run ESLint checks
- `npm run lint-fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run all tests
- `npm test -- -t "test name"` - Run specific test
- `jest components/path/Component.test.tsx` - Test single file

## Code Style

- **TypeScript**: Strict typing. Use explicit return types for functions.
- **React**: Functional components with hooks. Props should be TypeScript interfaces.
- **Formatting**: 140 character line length, 2-space indent, single quotes, trailing commas.
- **Imports**: Group imports by external libraries first, then internal modules.
- **Error Handling**: Use try/catch blocks with appropriate error logging.
- **Testing**: Use React Testing Library with custom render method from test-utils.
- **State Management**: Prefer React Query for API state, local state with hooks.
- **Naming**: PascalCase for components, camelCase for functions/variables.

## Project Structure

- **components/**: React components organized by feature
- **pages/**: Next.js pages and API routes
- **utils/**: Utility functions and shared logic
- **prisma/**: Database schema and migrations
- **interfaces/**: TypeScript type definitions
- **consts/**: Constant values used throughout the application

## Architecture Rules

- Always run `npm run type-check` after making changes
- New components should be added to the appropriate feature folder
- New API endpoints should follow REST conventions
- MUI components should be used for UI elements
- Use React Query hooks (`use-get.ts`, `use-post.ts`) for data fetching
- Always handle loading and error states in components
- Follow the pattern of existing similar components when creating new ones

## Code Simplicity and Reuse

- **Favor simplicity**: Choose the simplest solution that meets requirements
- **Reuse existing utilities**: Check for existing utils before writing new ones
- **Avoid over-engineering**: Don't add complexity for anticipated future needs
- **Minimize dependencies**: Use existing dependencies before adding new ones
- **DRY principle**: Extract repeated logic into reusable functions
- **Component composition**: Build complex UIs from simple, reusable components
- **Consolidate similar code**: Merge similar components or functions when appropriate

## Common Patterns

- For forms, use components from `components/form/` folder
- Use proper authorization checks with `has-access.ts` utilities
- API handlers should validate session and permissions
- Prisma queries should use the singleton from `utils/prisma/init.ts`

## Features

- Users become a member if they have a subscription payment this calendar user
- Events have attendees and can be checked in
- Forms can be created for various purposes
- Admin dashboard provides statistics and management tools
- User roles control access to different features
