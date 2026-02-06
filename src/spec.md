# Specification

## Summary
**Goal:** Improve the user panel dashboard header readability, ensure the user dashboard fits cleanly within the visible frame on mobile, and display a stable serial user ID assigned by registration order.

**Planned changes:**
- Update the UserDashboard (user panel only) header to show the session username in larger, high-contrast white text, with the numeric user ID centered on its own line directly beneath it (e.g., “User: OPU” then “ID: 1”).
- Adjust the user panel dashboard layout so header, tiles grid, and footer remain inside the dashboard frame/viewport on common mobile sizes, avoid left/right overflow, and prevent horizontal scrolling (user panel only; admin panel unchanged).
- Implement stable auto-increment user ID assignment by registration order (starting at 1) so IDs are assigned when registration requests are created, retained through approval regardless of approval order, and remain consistent across sessions (including backfilling missing IDs for existing approved users exactly once).

**User-visible outcome:** In the user dashboard, the username and ID are clearly readable and properly stacked/centered, the full dashboard layout fits within the screen without overflowing, and the user consistently sees the same serial ID based on registration order.
