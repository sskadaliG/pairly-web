# pairly-web

The frontend for **Pairly**, a Tinder-inspired dating application. The backend (REST API) lives in a separate `pairly` project.

## Tech stack

- [React 19](https://react.dev) with the [React Compiler](https://react.dev/learn/react-compiler)
- [Vite](https://vite.dev) for the dev server and builds
- [Tailwind CSS v4](https://tailwindcss.com) for styling
- [daisyUI v5](https://daisyui.com) for UI components, locked to the light theme
- [React Router v7](https://reactrouter.com) for client-side routing
- ESLint for linting

## Getting started

Requires [Node.js](https://nodejs.org) (current LTS).

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

## Scripts

| Command           | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload        |
| `npm run build`   | Build for production into `dist/`           |
| `npm run preview` | Serve the production build locally          |
| `npm run lint`    | Run ESLint                                  |

## Project structure

```
src/
├── main.jsx              # Entry point, renders <App />
├── App.jsx               # Router and route definitions
├── index.css             # Tailwind and daisyUI setup
└── components/
    ├── Body.jsx          # Page layout: navbar, page content, footer
    ├── NavBar.jsx        # Pairly logo on the left, user photo on the right
    ├── Footer.jsx        # Footer kept at the bottom of the page
    ├── Login.jsx         # Login page (placeholder)
    └── Profile.jsx       # Profile page (placeholder)
```

## Routes

All pages render inside the `Body` layout, so the navbar and footer appear on every page. The current page is rendered through React Router's `<Outlet />`.

| Path       | Page      |
| ---------- | --------- |
| `/`        | Layout only (navbar and footer) |
| `/login`   | Login     |
| `/profile` | Profile   |

## Styling

- `src/index.css` imports Tailwind and enables daisyUI with only the light theme, so the page background stays white even when the system uses dark mode.
- The navbar uses `bg-blue-300` and the footer uses the slightly darker `bg-blue-400`.
- The layout fills the screen (`min-h-screen` with a flex column), so the footer stays at the bottom on short pages.

## Status

In progress. The layout and routing are in place. The Login and Profile pages are placeholders and are not connected to the backend yet.
