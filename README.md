# FocusFlow — Daily Productivity Planner

A mobile-responsive task planner built with **HTML5, CSS3 and vanilla JavaScript**. No framework, API keys, backend, or package installation required.

## Implemented feature path

**Create task → validate input → save in Local Storage → list tasks → complete / delete / filter tasks**

- **Create:** Select **New task**, **Add task**, or **Create first task**, enter a title (required), optional description and due date, then select **Save task**.
- **Validate:** Reject blank/whitespace-only titles and titles shorter than 3 characters. Titles are limited to 80 characters; descriptions to 300 characters. Field-level error messages are accessible.
- **List:** Newly created tasks appear immediately, newest first. The list is built with DOM `textContent` to avoid HTML injection.
- **Empty states:** A helpful first-use state appears when no tasks exist. The *To do* and *Completed* filters display their own empty-state messages.
- **Manage:** Mark tasks completed or incomplete, delete tasks (with confirmation), filter All / To do / Completed. Dashboard counters update instantly.
- **Persistence:** Tasks are stored in browser `localStorage`, so they survive refreshing the page on the same browser/device. Data is **not** synced across devices.

## Run locally

1. Download and unzip this repository (or clone it).
2. Open `index.html` in any modern browser.
3. For local development, optionally use VS Code **Live Server** to serve the project.

## Files

- `index.html` — accessible page structure, form, modal, dashboard.
- `styles.css` — responsive desktop/mobile design.
- `app.js` — task state, validations, DOM rendering, persistence and filters.

## Manual testing checklist

- [ ] First load: empty-state message and zero totals are visible.
- [ ] Click **Add task** then **Save task** with a blank title: required error appears.
- [ ] Enter `Hi`: minimum 3-character error appears.
- [ ] Enter `Review lecture notes`, then save: task displays; counters update.
- [ ] Refresh browser: task is still present.
- [ ] Check task: it moves to Completed filter, counters update.
- [ ] Switch between All / To do / Completed filters; empty-state messages appear when appropriate.
- [ ] Delete task and confirm: it disappears; first-use state returns when list is empty.
- [ ] Verify layout on a narrow/mobile viewport.

## Publish your repository to GitHub

1. Sign in to GitHub and select **New repository**.
2. Name it `FocusFlow-Planner` and create it without initializing a README.
3. Use **Add file → Upload files** and upload `index.html`, `styles.css`, `app.js`, and `README.md`.
4. Select **Commit changes**.
5. Copy the URL from the repository's address bar (for example `https://github.com/YOUR-USERNAME/FocusFlow-Planner`) and submit **your actual URL** to the assignment portal.

Optional GitHub Pages: **Settings → Pages → Deploy from a branch → main / (root) → Save**.

## Notes

This is a mobile-responsive **web app**, not Flutter or React Native. This implementation fulfills the assignment's complete create-and-list feature path with validation and empty states.
