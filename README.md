# Athlete OS

A private, single-file athlete command center for tournament planning, athlete profile building, budgeting, sponsor tracking, milestones, and printable documents.

## Free setup options

### Option A: Private GitHub repo, local use only
This is the safest free option.

1. Create a private GitHub repository named `athlete-os`.
2. Upload `index.html` to the repository root.
3. Invite Ramona and family as collaborators if they need the file.
4. Each person downloads the repo or the `index.html` file and opens it in their browser.
5. Use `Data > Export JSON backup` after edits.
6. To move data to another computer, import the JSON backup.

Data is stored in each browser using `localStorage`. It does not sync automatically.

### Option B: Free web URL with actual access control
Use Cloudflare Pages plus Cloudflare Access. This gives you a web URL and email-based login protection on the free tier for a small family group.

High-level steps:

1. Keep the GitHub repository private.
2. Create a free Cloudflare account.
3. Go to Workers & Pages > Create application > Pages.
4. Import the private GitHub repo.
5. Build settings:
   - Framework preset: None
   - Build command: leave blank
   - Build output directory: `/`
6. Deploy.
7. In Cloudflare Zero Trust / Access, create an application for the Pages site.
8. Add an allow policy for specific email addresses.
9. Test from a private browser window.

## Storage and security

This app has no backend database. It stores data in browser localStorage.

Pros:
- Free
- Simple
- No build step
- Works as a single file
- Easy to back up as JSON

Limits:
- No automatic sync across family devices
- Browser storage can be cleared
- The app should not be published publicly with private athlete data

