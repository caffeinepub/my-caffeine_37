# Deployment Retry Runbook

## Purpose
This document describes how to retry a build/deploy for the current project revision without making source code changes.

## When to Use
- After intermittent deployment failures
- When deployment errors occur without code issues
- Network or infrastructure-related deployment problems

## Retry Process

### 1. Trigger Rebuild
Simply request "আবার বিল্ড কর" (rebuild) to trigger a new deployment attempt with the current codebase.

### 2. Monitor Deployment
Watch for:
- Build compilation success
- Canister deployment status
- Network connectivity issues
- Resource allocation problems

### 3. Capture Logs (If Failure Repeats)
If the deployment fails again, capture:
- Build output logs
- Error messages and stack traces
- Deployment step where failure occurred
- Network/infrastructure error codes

### 4. Common Issues & Solutions

#### Network Timeouts
- Retry the build (most common fix)
- Check Internet Computer network status

#### Resource Limits
- Verify canister cycle balance
- Check memory/storage limits

#### Build Cache Issues
- Clear build cache if available
- Retry with fresh build

## Notes
- Most deployment errors are transient and resolve on retry
- No code changes are needed for retry attempts
- This runbook does not modify application functionality
