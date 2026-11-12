[README.md](https://github.com/user-attachments/files/34757520/README.md)
# Finance Simplified Career Desk

Static website. No server or database. Open `index.html` to view it; host it free on GitHub Pages.

## Folder layout
- `index.html`  home page (Olympiad, CA route checker, planner, quiz, course, dates and fees, FAQ, WhatsApp, enquiry)
- `css/style.css`  all colours (tokens at the top), fonts and layout, shared by every page
- `js/app.js`  all logic. Rules sit between `PURE-START` and `PURE-END`
- `404.html`  shown for a wrong address
- `.nojekyll`  tells GitHub Pages to serve the files as they are

## Settings to fill in
- `js/app.js`: `WA_NUMBER` (your WhatsApp number with country code, digits only, e.g. 919876543210) and `GFORM_URL` (your Google Form link). Search the file for each name.

## Update each exam cycle
Edit the dates and fees in `index.html` (section "Dates and fees") and the Olympiad block, then change "Last checked". Confirm everything on icai.org first.

## Adding pages later
1. Copy `index.html` to a new file, e.g. `about.html`, `schools.html`, `resources.html`, `parents.html`.
2. Keep the `<head>` and the header and footer, replace the middle with the new content, and keep `<script src="js/app.js">` only on pages that use the tools.
3. Add a link to the new page in the header menu of every page.

## Suggested growth path
1. About page (wording cleared with the ICAI Committee).
2. Schools page: how a school can host an ICAI career counselling programme.
3. Resources page: dated notices, exam schedules, fee changes.
4. Parents' guide page, expanded from the FAQ.
5. Move enquiries into a Google Sheet through the Google Form.
6. Free analytics (e.g. Google Analytics) once you need visitor counts.
7. Custom domain and HTTPS through GitHub Pages settings.
8. A backend (bookings, payments, logins) only if the site outgrows a static page.

## Before going public
Get the ICAI Committee's written view on the counsellor wording and the site name, and keep fees off the public pages.
