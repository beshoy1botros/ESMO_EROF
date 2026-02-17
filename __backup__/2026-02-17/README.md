# Backup Snapshot — 2026-02-17

This folder contains archived files that were not referenced by the current application code at the time of cleanup. They are preserved here for safe rollback and future reference.

Archived categories:

- app/components: OptimizedImage component and its stylesheet
- app/utils: serviceWorker helper (not wired to the app)
- app/styles: experimental enhanced styles not imported by routes

Notes:

- These files were moved out of the active source tree to reduce bundle size and maintenance cost.
- You can restore any file by moving it back to its original location.
