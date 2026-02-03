# Specification

## Summary
**Goal:** Refresh Smart Hisab Pro with a clean, modern, consistent UI while keeping all existing admin/user features and localStorage persistence, improve production history readability by showing worker names, add admin save confirmations, and fix logout reliability in packaged runtime.

**Planned changes:**
- Redesign UI/UX across login/registration, admin panel, and user dashboard/history with a single coherent theme (excluding blue+purple), consistent spacing/typography/colors, and unified component styling.
- Update User Panel → Production History to display associated worker name(s) for each production entry, including readable formatting for multiple workers and safe fallbacks when worker data is missing.
- Add English confirmation messages (toast/snackbar/alert) for successful admin actions across relevant sections, and show error messages on failures instead of success confirmations.
- Fix Logout to reliably clear session/auth and in-memory UI state and return to the login screen without relying on `location.reload`.
- Add provided generated static images under `frontend/public/assets/generated` and reference them directly in the UI (e.g., login header/brand area).

**User-visible outcome:** The app looks consistently modern across all screens, admin actions provide clear English feedback, users can see worker names in production history entries, and Logout works reliably in the packaged app by returning to the login screen and preventing access until re-login.
