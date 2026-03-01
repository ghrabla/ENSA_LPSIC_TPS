# ENSA Labs

A collection of practical exercises for a web technologies and programming course.

## Structure

### `tps_code_1/`
First batch of lab exercises:

| Folder | Content |
|---|---|
| `tp_c/` | C language exercises (TVA, circle, math, pointers, expressions, sign) |
| `tp_html/` | Basic multi-page HTML site (index, contact, about) |
| `tp_css/` | Introductory CSS styling |
| `tp_css_2/` | CSS layout exercises: float, position, pseudo-classes, pseudo-elements, inheritance |
| `tp_js/` | JavaScript exercises: calculator (v1 & v2), clock, window management |
| `tp_xml/` | XML/DTD exercises: bibliography and CD catalog with validation reports |

### `tps_code_2/`
Second batch of lab exercises:

| Folder | Content |
|---|---|
| `tp_c/` | Medical cabinet management system in C (file-based persistence) |
| `tp_web/` | Full-stack-style SPA: authentication + Users CRUD (HTML/CSS/Vanilla JS) |

#### `tps_code_2/tp_c/` – Medical Cabinet Management

A console-based C program for managing patients and appointments in a medical practice.

**File:** `medical.c` — compile with `gcc medical.c -o medical`

**Data structures:**

| Struct | Fields |
|---|---|
| `Patient` | `id`, `name[50]`, `age`, `phone[15]` |
| `Appointment` | `patientId`, `date[11]` (YYYY-MM-DD), `time[6]` (HH:MM), `reason[100]` |

**Features:**
- Add a patient — stored via `fwrite` to `patients.dat`
- List all patients — read with `fread` and formatted table output
- Schedule an appointment (rendez-vous) — stored to `appointments.dat`
- List all appointments — formatted table output
- Interactive menu loop with exit option
- Binary file persistence across runs

#### `tps_code_2/tp_web/` – Users Management App

A single-page web application built with **no frameworks** — only HTML, CSS, and Vanilla JavaScript.

**Files:**

| File | Role |
|---|---|
| `index.html` | Login page — centered card, form validation, password toggle |
| `dashboard.html` | CRUD dashboard — users table, add form, edit modal, pagination |
| `style.css` | Full responsive stylesheet |
| `auth.js` | Mock authentication, token storage (`localStorage`), route guard, logout |
| `users.js` | Full CRUD via `fetch()` against JSONPlaceholder API |

**Features:**
- Login with mock credentials (validated locally, token stored in `localStorage`)
- Route guard: `dashboard.html` redirects to login if no token
- GET users from `https://jsonplaceholder.typicode.com/users` with client-side pagination
- POST / PUT / DELETE with optimistic local cache updates
- Client-side search filter
- Loading spinner, success/error alerts, form validation, XSS escaping

**Test credentials:**
```
eve.holt@reqres.in  /  cityslicka
admin@demo.com      /  password123
user@test.com       /  test1234
```

Open `index.html` in a browser to start (no server required).

### `tps_networking_1/`
Networking lab resources (Kubuntu Konsole screenshots/files).
