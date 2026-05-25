# 🕊️ Biblegram AI Coding Assistant Strict Operational Rules

This file outlines strict operational rules that all AI coding assistants (including Antigravity, Cursor, and other agents) **MUST** follow during every single coding, modification, and deployment task on the Biblegram project.

---

## 🚨 CRITICAL RULE: Automatic Versioning & Update History Modal Updates

Whenever you modify any code, implement new features, or perform a Vercel deployment, you **MUST** automatically:

1. **Increment the App Version**:
   - Locate the current version string in `App.jsx` (e.g., `v1.6.0`) inside the settings panel and modal titles, and increment the patch version (e.g., to `v1.6.1`).

2. **Update the "업데이트 내역" (Update History) Modal**:
   - Locate the `isUpdateModalOpen` modal in `App.jsx` (around line 5000+).
   - Proactively prepend a new version block (e.g., `v1.6.1` with current date) at the top of the version history list.
   - Summarize the exact user-facing changes, features, and fixes implemented during the current session in a warm, respectful, and clear Korean tone matching the chapel aesthetics ("성소", "은혜", "성도님").
   - ⚠️ **STRICT CONTENT FILTERING RULE**:
     - **ONLY** write general-user improvements and bug fixes in simple, easy-to-understand language.
     - **FILTER OUT** any tester-specific features (such as "test account", "tester login", "admin password verification"), developer-internal refactoring details, or database-specific technical jargon (e.g., "Supabase", "DB", "RLS", "UI mapping code", "API constraints").
     - General users should only see clean, simple, and warm feature improvements and bug fixes without any behind-the-scenes engineering details.
   - ⚠️ **MAX HISTORY LIMIT RULE**:
     - **ONLY** keep the most recent **3 to 4 versions** in the update history list of the modal.
     - When prepending a new version, automatically remove/prune any older version blocks at the bottom so that the total count of version cards in the modal strictly does not exceed 4 (ideally keeping exactly 3 to 4 versions).

3. **Verify and Build**:
   - Run `npm run build` to ensure the compilation succeeds with zero errors after applying these updates.

*This rule is absolute and must be followed on every session, even if the user does not explicitly mention it in their prompt.*
