# Specification

## Summary
**Goal:** Update Admin Production data entry to support separate Double/Single quantities and rates with correct totals, and improve User Dashboard readability and mobile fit.

**Planned changes:**
- Update Admin > Production form UI to include 4 numeric inputs (quantityDouble, quantitySingle, rateDouble, rateSingle) laid out as quantities first, then rates, with required/valid (non-negative numeric) validation.
- Update Admin > Production calculations and stored history to compute total = (quantityDouble * rateDouble) + (quantitySingle * rateSingle), persist the four fields plus computed totals, update the history table display, and ensure delete reverses the correct computed total.
- Update User > Production History to list all workers and show each worker’s Double/Single quantities (and derived totals/earnings) from the new production history data, including clear 0/no-record states.
- Increase font size for the four User Dashboard tiles (Production, Snacks, Payment/Loan, Work) without clipping/overlap on common mobile widths.
- Adjust User Panel typography and mobile layout to reduce excessive spacing, keep text readable, and ensure content is scrollable and not hidden behind any fixed footer.

**User-visible outcome:** Admins can enter and manage production using separate Double/Single quantities and rates with accurate totals and history, while users see an all-workers production history with Double/Single breakdowns and a more readable, mobile-friendly dashboard that fits within the viewport.
