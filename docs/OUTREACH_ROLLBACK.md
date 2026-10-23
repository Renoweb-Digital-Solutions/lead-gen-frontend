# Outreach deferred; Google identity retained

Date: 2026-10-23.

- Primary branch: `master`. This repository's remote deployment branch keeps its existing name.
- Outreach is preserved on the existing local and remote `dev/outreach` branch.
- Rollback commit: `4c0afc9`. It reverts the outreach merge using its first parent and restores the exact pre-outreach tracked file tree.
- OAuth was preserved before rollback on local `backup/google-oauth-before-outreach-rollback-20261023`, then reapplied independently above the rollback.
- Only the rollback is pushed during this operation. The OAuth commit remains local on `master` until the user chooses to push it.

## Scope

Lead selection for email, the outreach split view, mailbox connection/disconnection settings, synthetic lead mode, outreach sending routes and the sending worker are absent from the primary source tree. Regular lead generation/export and the older administrator email studio remain. Google identity signin/signup, application OTP verification, token validation, callback recovery and clock-skew handling remain in the local OAuth commit. Google signin requests identity scopes only.

No Google Cloud registrations, application SMTP settings, private environment credentials or database records are deleted. Stopping outreach requires the deployed backend to run the reverted code; queued outreach data is not erased by this Git rollback. Remote branch updates do not by themselves prove that a hosting rollout completed.

## Resuming research

Check out `dev/outreach` to continue from the preserved implementation. Because its merge is reverted on the primary branch, merging that unchanged branch again does not automatically restore the feature. When ready, integrate the new work and deliberately revert the rollback commit on a review branch, resolving conflicts with the newer standalone authentication implementation. Validate that identity sign-in stays separate from mailbox authorization.
