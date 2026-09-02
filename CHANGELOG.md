# Refactor changelog

## Codebase cleanup

- Split the product page into focused gallery, variant selector, and EMI plan components.
- Added shared TypeScript product/EMI response types.
- Added a small currency formatting helper.
- Removed `any` usage from application routes and components.
- Improved MongoDB connection caching and reset the cached promise after a failed connection.
- Added basic schema validation for product and variant fields.
- Simplified API responses and stopped exposing internal database error messages to clients.
- Normalized image gallery handling in the product API and gallery component.
- Replaced the `RAM: null` UI output with the actual variant label.
- Removed the unused Samsung Titanium Violet finish from seed data.
- Kept product-specific image URLs in seed data only; the frontend receives them through the API.
- Removed the stale TypeScript build-info artifact from the project package.

## Documentation

- Reworked README setup, schema, API, image-flow, EMI, and deployment sections.
- Removed outdated placeholder API examples.
- Added a demo checklist and current project structure.

## Verification

- Static source audit completed for hardcoded product/image data in `src/`.
- Static source audit completed for `placehold.co`, `RAM: null`, TODO/FIXME markers, and `any` usage.
- `npm ci` was attempted, but dependency installation timed out in the execution environment.
- `npm run build` could not be executed successfully because the timed-out install left the local `next` binary unavailable.
- MongoDB seed/API runtime checks require the project's configured `MONGODB_URI` and were not run against the user's database.
