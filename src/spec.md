# Specification

## Summary
**Goal:** Align accounting behavior and reporting between Admin/User panels while improving Admin UX (confirmations, header actions/styling, and mobile-safe bottom navigation).

**Planned changes:**
- Make Admin Production report-only: keep saving/deleting production history entries but stop any balance/account updates from Production actions.
- Make User Production report match Admin Production exactly (same report format, fields, aggregation, and underlying history source), remaining report-only.
- Fix Work Management accounting: remove any rate input, use each selected worker’s saved rate to compute per-worker amounts and a grand total, store these in WorkHistory, and credit each selected worker’s earnings (bill); reverse on delete.
- Ensure deductions (Nasta, Payment/Loan) continue to reduce net balance by increasing cost so remaining equals bill minus cost.
- Add confirmation popups on submit for Admin Nasta Management and Admin Payment & Loan Management (single-confirm flow and prevent double-submits).
- In System Settings, give the four tabs (Label, Total, Layout, Branding) distinct button colors while keeping active state clear.
- Add Admin header quick actions: “MT-LOAN” button (left of Support/Chat) and a Calculator button (right of Support/Chat), both wired to placeholder click actions.
- Improve Admin header styling with clearer separation (subtle border and/or backdrop blur) and consistent shadow without sticky scroll layout shift.
- Adjust bottom navigation/footer to be safe-area aware on mobile with a styled container/bar so app controls don’t clash with the phone’s system navigation.

**User-visible outcome:** Production becomes a pure report in both Admin and User panels, Work entries correctly credit worker earnings while Nasta/Payment/Loan remain deductions, Admin submissions for Nasta and Payment/Loan require confirmation, and the Admin UI has cleaner header actions/styling plus a bottom nav that remains clear and usable on mobile devices.
