/**
 * Book Tracker — script.js
 *
 * Prompt 3: book creation and list rendering.
 * Prompt 4: live search by title and author.
 * Prompt 5: localStorage persistence and in-card status updates.
 * - In-memory array of book objects (id, title, author, status, createdAt).
 * - Form submission handled via 'submit' event; page never reloads.
 * - User-supplied strings are set via textContent only — never innerHTML.
 * - Books are displayed newest-first.
 * - Three display states: empty-library / no-results / book cards.
 * - Persistence: saved to / loaded from localStorage on every mutation.
 *
 * JavaScript is loaded via `defer` in index.html.
 */

/* ─── State ──────────────────────────────────── */

/** localStorage key for the saved books array. */
const STORAGE_KEY = 'bookTrackerBooks';

/** @type {Array<{id: string, title: string, author: string, status: string, createdAt: number}>} */
let books = [];

/* ─── DOM References ─────────────────────────── */

const form         = document.getElementById('add-book-form');
const titleInput   = document.getElementById('book-title');
const authorInput  = document.getElementById('book-author');
const statusInput  = document.getElementById('book-status');
const bookList     = document.getElementById('book-list');
const emptyState   = document.getElementById('empty-state');
const noResults    = document.getElementById('no-results');
const searchField  = document.getElementById('search-input');
const storageError = document.getElementById('storage-error');
const formError    = document.getElementById('form-error');

/* ─── Helpers ────────────────────────────────── */

/**
 * Generate a simple unique ID from timestamp + random suffix.
 * @returns {string}
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Map a status value to its display label.
 * @param {string} status
 * @returns {string}
 */
function statusLabel(status) {
  const labels = { 'to-read': 'To Read', reading: 'Reading', finished: 'Finished' };
  return labels[status] ?? status;
}

/**
 * Map a status value to its CSS badge modifier class.
 * @param {string} status
 * @returns {string}
 */
function statusBadgeClass(status) {
  const classes = {
    'to-read': 'badge--to-read',
    reading:   'badge--reading',
    finished:  'badge--finished',
  };
  return classes[status] ?? '';
}

/**
 * Display an inline error message in the add-book form.
 * @param {string} message
 */
function showFormError(message) {
  if (!formError) return;
  formError.textContent = '';

  const icon = document.createElement('span');
  icon.className = 'form-error__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '⚠️';

  const text = document.createElement('span');
  text.className = 'form-error__text';
  text.textContent = message;

  formError.appendChild(icon);
  formError.appendChild(text);
  formError.hidden = false;
}

/**
 * Clear and hide the add-book form inline error message.
 */
function clearFormError() {
  if (!formError) return;
  formError.textContent = '';
  formError.hidden = true;
}

/* ─── Rendering ──────────────────────────────── */

/**
 * Build a single <li> book card element for the given book object.
 * All user-supplied text is assigned via textContent.
 * @param {{ id: string, title: string, author: string, status: string }} book
 * @returns {HTMLLIElement}
 */
function createBookCard(book) {
  const li = document.createElement('li');
  li.className = 'book-card';
  li.dataset.id = book.id;

  // Title
  const titleEl = document.createElement('p');
  titleEl.className = 'book-card__title';
  titleEl.textContent = book.title;

  // Author
  const authorEl = document.createElement('p');
  authorEl.className = 'book-card__author';
  authorEl.textContent = book.author;

  // Status select (colour-coded; data-status drives CSS)
  const select = document.createElement('select');
  select.className = 'card-status-select';
  select.dataset.bookId = book.id;
  select.dataset.status = book.status;
  select.setAttribute('aria-label', `Change reading status for "${book.title}"`);

  const statuses = [
    { value: 'to-read',  label: 'To Read'  },
    { value: 'reading',  label: 'Reading'  },
    { value: 'finished', label: 'Finished' },
  ];
  for (const { value, label } of statuses) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    if (value === book.status) opt.selected = true;
    select.appendChild(opt);
  }
  select.addEventListener('change', handleStatusChange);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn--icon-only btn--danger';
  deleteBtn.dataset.bookId = book.id;
  deleteBtn.setAttribute('aria-label', `Delete "${book.title}"`);
  deleteBtn.title = `Delete "${book.title}"`;
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `;
  deleteBtn.addEventListener('click', handleDeleteBook);

  // Controls container (status select + delete button)
  const controls = document.createElement('div');
  controls.className = 'book-card__controls';
  controls.appendChild(select);
  controls.appendChild(deleteBtn);

  // Meta column
  const meta = document.createElement('div');
  meta.className = 'book-card__meta';
  meta.appendChild(controls);

  li.appendChild(titleEl);
  li.appendChild(authorEl);
  li.appendChild(meta);

  return li;
}

/* ─── localStorage Persistence ───────────────── */

/**
 * Check whether localStorage is available and writable in the current browser environment.
 * Guards against restricted environments (e.g. sandboxed iframes, disabled third-party cookies, private mode).
 * @returns {boolean}
 */
function isStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Persist the current `books` array to localStorage.
 * Shows the storage-error banner on failure and leaves the in-memory
 * array intact so the session continues to work.
 */
function saveBooks() {
  if (!isStorageAvailable()) {
    if (storageError) storageError.hidden = false;
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    if (storageError) {
      storageError.hidden = true;
    }
  } catch (err) {
    console.error('Book Tracker: could not save to localStorage.', err);
    if (storageError) {
      storageError.hidden = false;
    }
  }
}

/**
 * Load books from localStorage into the `books` array.
 * Silently discards data that is missing, not valid JSON, or not an array.
 * Validates each book object to guard against corrupted or partial records.
 * Shows the storage-error banner if localStorage access itself throws.
 */
function loadBooks() {
  if (!isStorageAvailable()) {
    if (storageError) storageError.hidden = false;
    return;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return; // nothing saved yet

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const seen = new Set();
        const validBooks = [];
        for (const item of parsed) {
          if (!item || typeof item !== 'object') continue;
          const title = typeof item.title === 'string' ? item.title.trim() : String(item.title ?? '').trim();
          const author = typeof item.author === 'string' ? item.author.trim() : String(item.author ?? '').trim();
          if (!title || !author) continue;

          // Prevent duplicate entries from legacy/external storage state
          const key = `${title.toLowerCase()}|${author.toLowerCase()}`;
          if (seen.has(key)) continue;
          seen.add(key);

          validBooks.push({
            id: typeof item.id === 'string' && item.id ? item.id : generateId(),
            title,
            author,
            status: ['to-read', 'reading', 'finished'].includes(item.status) ? item.status : 'to-read',
            createdAt: typeof item.createdAt === 'number' && !Number.isNaN(item.createdAt) ? item.createdAt : Date.now(),
          });
        }
        books = validBooks;
      } else {
        console.warn('Book Tracker: stored data was not an array; ignoring.');
      }
    } catch (parseErr) {
      console.warn('Book Tracker: stored JSON corrupted; starting with empty library.', parseErr);
    }
  } catch (err) {
    console.error('Book Tracker: could not read from localStorage.', err);
    if (storageError) {
      storageError.hidden = false;
    }
  }
}

/* ─── Rendering ──────────────────────────────── */

/**
 * Filter the books array by a search query (case-insensitive, trimmed).
 * Matches against title and author. Preserves newest-first order.
 * @param {string} query
 * @returns {Array}
 */
function getFilteredBooks(query) {
  const q = (query || '').trim().toLowerCase();
  const sorted = [...books].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  if (!q) return sorted;
  return sorted.filter(b =>
    (b.title && b.title.toLowerCase().includes(q)) ||
    (b.author && b.author.toLowerCase().includes(q))
  );
}

/**
 * Re-render the book list for a given set of books to display.
 * Manages three mutually exclusive states:
 *   1. No books at all         → show #empty-state
 *   2. Books exist, none match → show #no-results
 *   3. Matching books          → render cards
 * @param {Array} booksToRender  Already-filtered, sorted list to display.
 */
function renderBooks(booksToRender) {
  // Clear existing rendered cards
  bookList.textContent = '';
  emptyState.hidden = true;
  noResults.hidden  = true;

  if (books.length === 0) {
    // State 1: library is empty
    emptyState.hidden = false;
    return;
  }

  if (booksToRender.length === 0) {
    // State 2: library has books but none match the query
    noResults.hidden = false;
    return;
  }

  // State 3: render matching cards
  const fragment = document.createDocumentFragment();
  for (const book of booksToRender) {
    fragment.appendChild(createBookCard(book));
  }
  bookList.appendChild(fragment);
}

/* ─── Form Submission ────────────────────────── */

/**
 * Handle the add-book form submit event.
 * Validates, creates a book object, prepends it to the array, re-renders.
 * @param {SubmitEvent} event
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const title  = titleInput.value.trim();
  const author = authorInput.value.trim();
  const status = statusInput.value;

  clearFormError();

  // Reject empty or whitespace-only values
  if (!title || !author) {
    if (!title) {
      showFormError('Please enter a book title.');
      titleInput.focus();
    } else {
      showFormError('Please enter an author name.');
      authorInput.focus();
    }
    return;
  }

  // Reject duplicate books (case-insensitive & trimmed comparison regardless of status)
  const isDuplicate = books.some(b =>
    b.title.trim().toLowerCase() === title.toLowerCase() &&
    b.author.trim().toLowerCase() === author.toLowerCase()
  );

  if (isDuplicate) {
    showFormError(
      `"${title}" by ${author} already exists in your library. You can update its reading status from the card below.`
    );
    titleInput.focus();
    return;
  }

  const book = {
    id:        generateId(),
    title,
    author,
    status,
    createdAt: Date.now(),
  };

  books.unshift(book);
  saveBooks();

  // Re-render respecting any active search query
  renderBooks(getFilteredBooks(searchField.value));

  // Reset only title and author; leave status at its current value
  titleInput.value  = '';
  authorInput.value = '';
  clearFormError();
  titleInput.focus();
}

/* ─── Search ─────────────────────────────────── */

/**
 * Handle live search input.
 * Filters the in-memory books array and re-renders without touching the array.
 * @param {Event} event
 */
function handleSearchInput(event) {
  renderBooks(getFilteredBooks(event.target.value));
}

/* ─── Status Change ────────────────────────── */

/**
 * Handle a status change from an in-card select element.
 * Updates the matching book in the array, saves, and re-renders
 * (preserving the active search query).
 * @param {Event} event
 */
function handleStatusChange(event) {
  const select   = event.target;
  const bookId   = select.dataset.bookId;
  const newStatus = select.value;

  const book = books.find(b => b.id === bookId);
  if (!book) return; // guard against stale references

  book.status = newStatus;
  saveBooks();

  // Update the data-status attribute so CSS colours update instantly
  // without a full re-render (avoids losing focus mid-interaction).
  select.dataset.status = newStatus;
}

/* ─── Delete Book ────────────────────────────── */

/**
 * Handle deleting a book from the library.
 * Removes the book from state, persists to localStorage, and re-renders.
 * @param {MouseEvent} event
 */
function handleDeleteBook(event) {
  const btn = event.currentTarget;
  const bookId = btn.dataset.bookId;
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  // Remove the book from memory
  books = books.filter(b => b.id !== bookId);
  saveBooks();

  // Clear any existing form error
  clearFormError();

  // Re-render respecting any active search query
  renderBooks(getFilteredBooks(searchField.value));
}

/* ─── Initialisation ─────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Both panels start hidden; renderBooks() manages visibility.
  emptyState.hidden = true;
  noResults.hidden  = true;
  if (storageError) {
    storageError.hidden = isStorageAvailable();
  }

  // Load any previously saved books before first render.
  loadBooks();

  form.addEventListener('submit', handleFormSubmit);
  searchField.addEventListener('input', handleSearchInput);
  titleInput.addEventListener('input', clearFormError);
  authorInput.addEventListener('input', clearFormError);

  // Initial render (may show saved books or empty state)
  renderBooks(getFilteredBooks(searchField.value));

  console.log('Book Tracker initialised.');
});
