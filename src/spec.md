# Specification

## Summary
**Goal:** Adjust the admin bottom navigation and headers to match expected controls (remove Settings tab, improve button sizing/borders, restore Logout), and ensure the clock/time area shows only time/date without stray labels.

**Planned changes:**
- Remove the “Settings” item from the admin fixed bottom navigation while keeping the Settings section reachable from another existing entry point (e.g., admin dashboard grid menu).
- Increase admin bottom navigation bar height and enlarge remaining nav buttons; add a visible border around each button in both active and inactive states.
- Restore a visible Logout control in the Admin panel header (removing the newly added replacement header button) and add a visible Logout control in the User panel header; ensure logout clears session and returns to logged-out state.
- Remove incorrect/stray labels (e.g., “MT Loan”, “HMT”) from the time display area so it shows only live-updating time/date.

**User-visible outcome:** Admins see a cleaner bottom nav without Settings, with larger bordered buttons; both Admin and User panels have a clear Logout option; the clock/time area no longer shows unrelated text.
