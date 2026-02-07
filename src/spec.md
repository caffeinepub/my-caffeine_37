# Specification

## Summary
**Goal:** Polish the admin panel UI for better readability and layout on mobile/desktop, focusing on Settings screens, dropdowns, KPI summary cards, confirmation dialogs, header avatar, and the fixed footer action buttons.

**Planned changes:**
- Enlarge the main white content card in the System Settings view (wider on mobile/desktop, more internal padding/vertical spacing) and place the Settings tabs inside a clearer rounded, bordered container.
- Fix Select/dropdown readability and layering in admin Settings (no blurred/cut text, consistent padding/line-height, correct overlay stacking/positioning).
- Improve contrast of the “Worker & Rate Settings” title and restyle inputs in that section to match the cleaner light input style used elsewhere (consistent background/border/focus ring).
- Add a right-side circular profile avatar to the AdminLayoutShell header, showing the stored profile photo when available and a static placeholder image when not.
- Reposition/restyle the bottom fixed action buttons (MT-LOAN / Support / Calculator) so they float cleanly above content without covering form controls; ensure pages add sufficient bottom spacing.
- Redesign the top three admin money summary cards so the numeric readout looks like a cohesive “display” (remove the harsh white patch behind numbers while keeping high contrast/readability).
- Update the shared ConfirmDialog UI to a rounder, more colorful (vibrant) style with clear confirm/cancel hierarchy and mobile-safe sizing.

**User-visible outcome:** Admin screens (especially System Settings) look cleaner and more spacious; dropdowns and inputs are easier to read; summary cards and confirmation dialogs look more polished; the header shows a profile avatar; and the fixed footer buttons no longer obscure page content.
