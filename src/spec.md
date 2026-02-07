# Specification

## Summary
**Goal:** Add MT Loan admin settings (name + password), gate MT Loan entry behind a password modal, and keep the User Panel fully hidden while preserving the existing UI design.

**Planned changes:**
- Add a new Settings card/section in the current empty top area of the Settings screen with Name input, Password input, and Save button; persist saved values locally across refresh.
- Add an MT Loan password prompt modal triggered by the existing MT-LOAN quick action; validate against the saved password and show an error on mismatch.
- On correct MT Loan password entry, mark the session as authorized for MT Loan and auto-create/store a local user identity record using the saved Name, without exposing any User Panel UI.
- Keep/add a User Panel layout skeleton in the codebase (including a logout button placeholder) while ensuring the entire User Panel remains fully blocked/inaccessible even after refresh.
- Ensure no design/styling changes outside inserting the new Settings card and adding the password modal using existing UI patterns.

**User-visible outcome:** Admin can save an MT Loan name and password in Settings; clicking MT-LOAN opens a password modal that blocks access on wrong password and accepts on correct password (preparing authorization/identity locally) while the User Panel remains completely hidden.
