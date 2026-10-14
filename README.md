# Book Tracker

A lightweight, client-side personal reading journal built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no backend, no database required.

---

## Purpose

Book Tracker lets you manage your personal reading list entirely in the browser. You can log books you want to read, track the ones you are currently reading, and record those you have finished.

---

## Features

- **Add Books**: Add books with a required title and author, plus an initial reading status (*To Read*, *Reading*, or *Finished*).
- **Validation & Duplicate Prevention**: Rejects empty or whitespace-only inputs, and prevents duplicate entries for the same book (compared case-insensitively and whitespace-trimmed), guiding the user to update the existing book's status instead of creating duplicate cards.
- **Newest-First Ordering**: Newly added books immediately appear at the top of the collection.
- **Real-Time Live Search**: Instant, case-insensitive search by title or author; typing filters the list dynamically without losing stored data.
- **Interactive Status Updates**: Change any book's reading status via an in-card dropdown; colors and data update immediately.
- **Delete Books**: Remove any book with an in-card delete button; updates the collection and browser storage immediately.
- **Persistent Storage**: All books and status changes are automatically saved to browser `localStorage` under `bookTrackerBooks` and reloaded on page visit.
- **Resilient & Error-Tolerant**: Corrupted stored JSON or inaccessible `localStorage` (such as disabled cookies or quota limits) is handled gracefully without crashing the app.
- **Safe DOM Rendering**: Uses `textContent` exclusively for all user input to prevent XSS vulnerabilities.
- **Responsive & Modern Design**: Clean book-themed aesthetic optimized for desktop, tablet, and mobile screens without any CSS/JS dependencies.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure and accessibility |
| CSS3 | Custom typography, CSS variables, grid/flex layouts, and responsive design |
| Vanilla JavaScript (ES6+) | App state management, DOM manipulation, and search filtering |
| Browser `localStorage` | Client-side data persistence across browser sessions |

No build tools, package managers, or external dependencies are required.

---

## Project Structure

```
book-tracker/
├── index.html       # Application HTML structure and semantic layout
├── style.css        # Complete styling, CSS variables, and responsive rules
├── script.js        # Core logic: state, persistence, search, and DOM rendering
├── README.md        # Project documentation, architecture, and guides
├── PROMPTS.md       # Development log documenting AI prompts and verifications
└── .gitignore       # Git ignore rules for OS, IDE, and temporary files
```

---

## How to Run

1. Clone or download this repository to your local machine.
2. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
3. No web server, runtime, or installation step is required.

---

## Data Storage & localStorage Limitations

Book Tracker stores your library entirely on the client side in the browser's **`localStorage`** under the key `bookTrackerBooks`. No data is ever sent to an external server.

### What this means in practice

| Aspect | Detail |
|---|---|
| **Persistence** | Books and statuses survive page refreshes and browser restarts on the same device and browser profile. |
| **Storage Limit** | `localStorage` provides roughly 5 MB of storage per origin. A clear warning banner is displayed if a storage write fails. |
| **No Cross-Device Sync** | Data is strictly local to the current browser profile; it does not automatically sync between different browsers or devices. |
| **Private Browsing** | In Private/Incognito mode, browsers may block `localStorage` or discard stored data as soon as the private session is closed. |
| **Data Loss** | Clearing browser website data or cache will permanently delete your stored books. |

