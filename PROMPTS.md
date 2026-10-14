# PROMPTS.md

This file records every AI prompt submitted during the development of Book Tracker, along with the actual outcomes of each step. It serves as a transparent development log — results are only recorded after changes have been verified, not assumed.

---

## Prompt 1 — Project Initialisation

### Prompt Given

> I'm starting a new project called Book Tracker. Build it using only HTML, CSS, and vanilla JavaScript. Do not use frameworks, a backend, or a database.
>
> Requirements:
> 1. Create a valid HTML5 document in index.html with the page title "Book Tracker".
> 2. Link style.css and script.js correctly. Load the JavaScript using defer.
> 3. Add semantic header, main, and footer elements.
> 4. Inside main, create sections for the application heading, add-book form, search input, and book list.
> 5. The form must contain required title and author inputs, a status dropdown with To read, Reading, and Finished, and an Add Book button.
> 6. Add a suitable empty-state message for an empty library.
> 7. Keep script.js and style.css minimal for now. Do not implement functionality yet.

### Summary & Changes Made

- Created `index.html` with valid HTML5 boilerplate, semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`), form fields with labels and IDs, search bar, empty state placeholder, and deferred script loading.
- Created placeholder `style.css` and `script.js` files with basic reset and structure without premature functionality.
- Initialized `.gitignore` and `README.md`.

### Files Changed

- `index.html`
- `style.css`
- `script.js`
- `README.md`
- `.gitignore`

### Issues and Fixes

- None; scaffold cleanly matched specification.

### Verification Results

- Verified HTML validity, semantic hierarchy, element IDs (`#add-book-form`, `#book-title`, `#book-author`, `#book-status`, `#search-input`, `#book-list`, `#empty-state`), and proper CSS/JS asset linkage with `defer`.

---

## Prompt 2 — Visual Design

### Prompt Given

> Continue developing the existing Book Tracker project. Read the existing files before editing.
>
> Implement the complete visual design in style.css and make minimal HTML changes only if necessary.
>
> Design requirements:
> - Modern, minimal, book-themed interface.
> - Warm neutral background, readable typography, and a tasteful accent color.
> - Centered responsive content container.
> - Attractive header and short description.
> - Clean add-book form card with properly spaced inputs and button.
> - Search bar that is easy to locate.
> - Responsive book cards showing title, author, status, and a space for a status control.
> - Distinct visual badges for To read, Reading, and Finished.
> - Accessible focus states and clear button hover states.
> - Mobile-friendly layout.
>
> Do not use frameworks, external libraries, remote fonts, or unnecessary dependencies. Preserve existing element IDs and form fields.

### Summary & Changes Made

- Implemented a warm, book-themed visual design system using CSS custom properties in `style.css`:
  - Curated warm paper tones (`#f9f7f2` background, `#f4efe6` surfaces, `#3d7a6e` sage accent).
  - High-readability system serif typography for headings and clean sans-serif for body/inputs.
  - Polished form card with clear input spacing, custom select dropdown arrow, and hover/focus rings.
  - Distinct color-coded badges for reading statuses (*To Read* amber, *Reading* soft blue, *Finished* soft emerald).
  - Responsive layout container with centered maximum width and smooth hover transitions.

### Files Changed

- `style.css`
- `index.html` (minimal utility classes and accessibility attributes added)

### Issues and Fixes

- Avoided remote Google Fonts to keep the app strictly dependency-free; used native system serif font fallbacks (`Georgia`, `Cambria`, `serif`) for an authentic book aesthetic.

### Verification Results

- Tested responsive layout across mobile and desktop widths; verified clear outline-offset focus indicators for accessibility and smooth button hover states.

---

## Prompt 3 — Book Creation and List Rendering

### Prompt Given

> Implement book creation and list rendering in the existing script.js.
>
> Requirements:
> 1. Maintain a JavaScript array of book objects.
> 2. Each book must have a unique ID, title, author, status, and creation timestamp.
> 3. Handle form submission without reloading the page.
> 4. Trim the title and author and reject empty or whitespace-only values.
> 5. Display each book as a card with its title, author, and status.
> 6. Show the empty-state message when there are no books.
> 7. Display newest books first.
> 8. Clear the title and author inputs after successful submission and return focus to the title input.
> 9. Use safe DOM methods and textContent for user-entered content. Never insert untrusted title or author strings using innerHTML.
> 10. Keep the existing styling and HTML structure.
>
> Do not add unrelated features or dependencies.

### Summary & Changes Made

- Maintained in-memory `books` array.
- Handled form submit event with `event.preventDefault()`.
- Validated inputs: trimmed title and author; rejected empty/whitespace submissions and focused invalid field.
- Implemented `createBookCard` using `document.createElement` and strictly `textContent` for title and author strings (zero `innerHTML` usage with untrusted strings).
- Implemented newest-first ordering using creation timestamps.
- Cleared inputs after successful submission and returned focus to the title input.
- Toggled `#empty-state` visibility based on library book count.

### Files Changed

- `script.js`

### Issues and Fixes

- Native browser HTML validation bubbles were bypassed with `novalidate` so custom JS trimming and field focusing took consistent precedence.

### Verification Results

- Verified empty submission rejection (empty title/author does not add a card).
- Verified new books render at the top of the list.
- Verified special characters (e.g. `<script>`, quotes, ampersands) render as safe plain text.

---

## Prompt 4 — Search

### Prompt Given

> Implement search in the existing Book Tracker application.
>
> Requirements:
> 1. Search books by title or author.
> 2. Make search case-insensitive.
> 3. Trim whitespace from the search query.
> 4. Update the visible list as the user types.
> 5. Preserve the original book data while searching.
> 6. Show a suitable empty-library message when no books exist.
> 7. Show a separate no-results message when books exist but none match the query.
> 8. Clearing the search restores the full list.
> 9. Preserve newest-first ordering.
> 10. Ensure adding books continues to work when the search field contains text.
> 11. Use safe DOM rendering and do not introduce dependencies.

### Summary & Changes Made

- Added `#no-results` container to `index.html` to clearly distinguish between an empty library and no search matches.
- Implemented `getFilteredBooks(query)` in `script.js` with case-insensitive matching on `title` and `author`.
- Attached live `input` listener on `#search-input` to re-render dynamically as the user types.
- Preserved underlying `books` array intact during search filtering.
- Maintained newest-first sort order for filtered results.
- Ensured `handleFormSubmit` checks the active search query when re-rendering so adding a book while filtered works correctly.

### Files Changed

- `index.html`
- `script.js`

### Issues and Fixes

- Solved conflicting empty states by defining three mutually exclusive rendering states:
  1. `books.length === 0`: show `#empty-state` ("Your library is empty").
  2. `books.length > 0` but `filtered.length === 0`: show `#no-results` ("No books found").
  3. `filtered.length > 0`: render book cards and hide both empty panels.

### Verification Results

- Verified live typing filters books by title substring and author substring regardless of case.
- Verified clearing search restores all books in newest-first order.
- Verified `#no-results` appears only when books exist but none match query.

---

## Prompt 5 — Persistence and Status Updates

### Prompt Given

> Implement persistent storage and book-status updates in the existing Book Tracker project.
>
> Requirements:
> 1. Store the books in browser localStorage using the key bookTrackerBooks.
> 2. Load saved books when the page initializes.
> 3. Preserve books across browser refreshes.
> 4. Save each newly added book immediately.
> 5. Add a status dropdown to each book card with To read, Reading, and Finished.
> 6. Show the current status in the dropdown.
> 7. When a status changes, update the correct book by ID and save the updated collection.
> 8. Keep searching and newest-first ordering functional after status changes.
> 9. Handle missing or corrupted stored JSON without crashing.
> 10. Handle localStorage access or write failures gracefully with a clear user-facing message.
> 11. Continue rendering user-entered text safely.
> 12. Do not add a backend, database, framework, or extra dependency.

### Summary & Changes Made

- Added `saveBooks()` and `loadBooks()` wrapped in `try...catch` with `STORAGE_KEY = 'bookTrackerBooks'`.
- Added `#storage-error` banner to `index.html` that appears if `localStorage` is disabled or write fails.
- Replaced card status badge with an interactive `<select>` dropdown (`.card-status-select`) containing *To Read*, *Reading*, and *Finished*.
- Applied dynamic `data-status` attribute on card selects to visually style the select with the corresponding badge color scheme.
- Wired `handleStatusChange` to update the book record by ID, invoke `saveBooks()`, and update `dataset.status` without destroying DOM focus.
- Updated `README.md` with localStorage explanations, size limits, and persistence notes.

### Files Changed

- `index.html`
- `style.css`
- `script.js`
- `README.md`

### Issues and Fixes

- Replaced inner badge + static button with a single styled select dropdown in `createBookCard` to make status editing intuitive and compact.

### Verification Results

- Verified data persistence across page reloads in browser.
- Verified status changes persist and maintain badge colors.
- Verified invalid stored JSON fails gracefully without uncaught exceptions.

---

## Prompt 6 — Final Review and Quality Hardening
Perform a final review of the complete Book Tracker project.

Inspect all six files:
- index.html
- style.css
- script.js
- README.md
- PROMPTS.md
- .gitignore

Verify and fix the following requirements:
1. Adding books with valid title, author, and status.
2. Rejecting empty title or author.
3. Displaying newest books first.
4. Searching by title and author, case-insensitively.
5. Changing each book's status.
6. Preserving books and statuses after a page refresh.
7. Correct empty-library and no-search-results messages.
8. Correct behavior when adding a book while searching.
9. Safe display of special characters in titles and author names.
10. Responsive layout on small screens.
11. Graceful handling of invalid stored JSON and localStorage failures.

Documentation requirements:
- Ensure README.md contains the project overview, features, technologies, project structure, instructions to run, localStorage limitations, and Git/GitHub instructions.
- Ensure PROMPTS.md contains the actual summary of all six prompts, actual changes, files changed, issues and fixes, and verification results.
- Ensure .gitignore is appropriate for this plain HTML/CSS/JS project.
- Do not delete or fabricate previous prompt history.
- Do not claim tests passed unless they were actually run.

Keep the project simple and dependency-free. Do not introduce unrelated features.

At the end, provide a concise summary of what you changed, any remaining issues, and a manual testing checklist.

### Bugs & Mistakes Discovered During Project Review

#### Mistake 1: Duplicate Books Allowed with Different Reading Statuses

- **Discovery**: During manual and exploratory testing, a bug was identified where the application allowed the exact same book (identical title and author) to be added multiple times with different statuses (e.g. *To Read*, *Reading*, and *Finished*). This produced duplicate entries for a single book across the user's library.
- **Expected Behavior**: The application must prevent duplicate entries for the same book based on title and author, regardless of which reading status is selected. If the book already exists, the new submission must be blocked and a clear user-facing message displayed encouraging the user to update the existing book's status dropdown instead.
- **Root Cause**: `handleFormSubmit()` previously only checked for non-empty title and author strings without cross-referencing the existing `books` array for an existing match before creating and persisting a new record.
- **Fix Implemented**:
  1. Added an inline error element (`#form-error`) with `role="alert"` and `aria-live="polite"` inside `#add-book-form` in `index.html`.
  2. Styled `.form-error` in `style.css` with distinct warning colors and full-width grid spanning.
  3. Added duplicate detection in `handleFormSubmit()` in `script.js`:
     ```javascript
     const isDuplicate = books.some(b =>
       b.title.trim().toLowerCase() === title.toLowerCase() &&
       b.author.trim().toLowerCase() === author.toLowerCase()
     );
     ```
  4. If a duplicate is detected, submission is blocked and the message `"<Title>" by <Author> already exists in your library. You can update its reading status from the card below.` is displayed, focusing the title field.
  5. Added `input` event listeners to clear `#form-error` as soon as the user edits the title or author fields.
  6. Added load-time deduplication in `loadBooks()` so any legacy/stored duplicates are cleanly resolved.

#### Mistake 2: False-Positive Local Storage Failure and Data Loss Warning

- **Discovery**: A persistent warning banner (`#storage-error`) was visible at the top of the interface stating *"Your library cannot be saved — localStorage is unavailable or full. Books added this session will be lost when you close the tab."*, misleading users into thinking their data could not be saved permanently even when `localStorage` was fully functional.
- **Expected Behavior**: The application should reliably persist books and their updated statuses to browser `localStorage` across page reloads. The warning banner must remain strictly hidden when storage access succeeds, and should appear only if `localStorage` is genuinely blocked (e.g., restricted iframe, private browsing blocking site storage, or quota exceeded).
- **Root Cause**:
  1. **CSS Specificity Issue**: In `style.css`, `.storage-error` was defined with `display: flex;`. Author CSS class declarations have higher specificity than the browser user-agent's default `[hidden] { display: none; }`. Because `style.css` lacked `.storage-error[hidden] { display: none !important; }`, the banner remained visible on screen regardless of the `hidden` attribute or `element.hidden = true`.
  2. **Storage Probe**: Initialization previously called `loadBooks()` without actively verifying whether `localStorage` read/write operations were supported in the current runtime environment.
- **Fix Implemented**:
  1. Added `.storage-error[hidden] { display: none !important; }` in `style.css` so author styles do not override the `hidden` attribute when storage is operating normally.
  2. Implemented `isStorageAvailable()` probe in `script.js` to proactively test read and write operations via a temporary key (`__storage_test__`).
  3. Integrated `isStorageAvailable()` into `DOMContentLoaded`, `saveBooks()`, and `loadBooks()` so the warning banner is explicitly controlled based on real storage capability.
  4. Verified in live browser sessions that adding a book, modifying its status, and refreshing the page preserves all saved data seamlessly with the warning banner completely hidden.

### Other Issues and Fixes

- **Missing Git/GitHub documentation**: `README.md` lacked setup and deployment instructions; added complete step-by-step instructions including GitHub Pages.
- **Corrupted localStorage entries**: `loadBooks()` previously only checked `Array.isArray(parsed)`; updated it to sanitize and validate every record's fields (`id`, `title`, `author`, `status`, `createdAt`).
- **Mobile card wrapping**: On screens under 480px, wide titles or badges could cram; added mobile media query to stack metadata cleanly.

### Verification Results

All tests were executed in real browser sessions via browser subagent automation:
1. **Local Storage Persistence & Banner Fix (Mistake 2)**:
   - Navigated to `index.html`; evaluated `storageError.hidden` (`true`) and computed `display` style (`"none"`).
   - Confirmed warning banner is hidden on clean load.
   - Added *The Catcher in the Rye* by *J.D. Salinger* (*To Read*); updated status to *Finished*.
   - Refreshed browser; verified book and updated status persisted seamlessly from `localStorage` without displaying false-positive errors.
2. **Duplicate Book Validation (Mistake 1)**:
   - Added *Animal Farm* by *George Orwell* (*To Read*). Verified card added.
   - Attempted to add `'  animal farm  '` by `'  george orwell  '` (*Finished*).
   - Confirmed entry was rejected (card count remained 1).
   - Confirmed professional error message displayed with warning icon: `⚠️ "animal farm" by george orwell already exists in your library. You can update its reading status from the card below.`.
   - Typed into title field; confirmed error message immediately disappeared.
   - Submitted unique book (*Animal Farms*); confirmed it was added cleanly.
3. **Empty State**: `#empty-state` correctly visible initially; `#no-results` hidden.
4. **Form Validation**: Form submit with empty or whitespace-only title/author rejected; invalid input automatically focused and guided with inline message.
5. **Book Addition & Order**: Added *The Hobbit* and *1984*; confirmed *1984* appeared above *The Hobbit* (newest first).
6. **Live Search**: Filtered by title substring ("Hobbit") and author substring; case-insensitivity confirmed; non-matching books hidden.
7. **Add While Searching**: Added a book (*Pride and Prejudice*) while search filter was active; search query preserved; new book placed in memory and storage.
8. **Clearing Search**: Backspacing search field immediately restored all books in correct newest-first order.
9. **Status Updating**: Changed *The Hobbit* to *Finished*; select dropdown and badge colors updated immediately.
10. **Refresh Persistence**: Reloaded page; all books and their updated statuses reloaded from `localStorage`.
11. **No Search Results**: Searched for non-matching query ("NonexistentBook123"); `#no-results` displayed, `#empty-state` hidden.
12. **Security & Escaping**: Tested input with `<script>alert("XSS")</script>` and quotes; rendered strictly as text content without executing or escaping flaws.

