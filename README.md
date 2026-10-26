# pairly-web

The frontend for **Pairly**, a Tinder-inspired app for meeting people. Browse a feed of people, send interest, accept or reject requests, and see your connections.

The backend (an Express + MongoDB REST API) lives in a separate `Pairly` project.

## Tech stack

- [React 19](https://react.dev) with the [React Compiler](https://react.dev/learn/react-compiler)
- [Vite](https://vite.dev) for the dev server and builds
- [Tailwind CSS v4](https://tailwindcss.com) for styling
- [daisyUI v5](https://daisyui.com) for UI components, with a custom `pairly` theme
- [React Router v7](https://reactrouter.com) for client-side routing
- [Redux Toolkit](https://redux-toolkit.js.org) and React Redux for app state
- [Axios](https://axios-http.com) for API calls
- ESLint for linting

## Getting started

Requires [Node.js](https://nodejs.org) (current LTS) and the Pairly backend running on http://localhost:3000.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

The backend must allow CORS from `http://localhost:5173` with `credentials: true`, because login uses an httpOnly cookie. The API address is set in `src/utils/constants.js` (`BASE_URL`).

## Scripts

| Command           | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload        |
| `npm run build`   | Build for production into `dist/`           |
| `npm run preview` | Serve the production build locally          |
| `npm run lint`    | Run ESLint                                  |

## Features

- **Login** with form validation and server error messages.
- **Stay logged in** after a refresh: the app loads the user from the cookie, or sends you to the login page.
- **Feed** showing one person at a time, with Ignore and Interested buttons. A new batch loads when the feed runs out.
- **Connection requests** from people interested in you, with Accept and Reject buttons.
- **Connections** list of people you've matched with.
- **Edit profile** with a live preview of your card.
- **Change password** with a confirmation check.
- **Initial avatars**: people without a photo get the first letter of their name.
- **Navbar** with a welcome message and a profile dropdown (Edit profile, Edit password, Connections, Requests, Logout).

## Project structure

```
src/
├── main.jsx                  # Entry point, renders <App />
├── App.jsx                   # Redux provider, router and routes
├── index.css                 # Tailwind, daisyUI and the custom pairly theme
├── components/
│   ├── Body.jsx              # Layout: navbar, page content (<Outlet />), footer
│   ├── NavBar.jsx            # Logo, welcome message, profile dropdown, logout
│   ├── Footer.jsx            # Footer kept at the bottom of the page
│   ├── Login.jsx             # Login form with validation
│   ├── Feed.jsx              # Home page: feed cards with Ignore / Interested
│   ├── UserCard.jsx          # Reusable person card; buttons passed as children
│   ├── Requests.jsx          # Received requests with Accept / Reject
│   ├── Connections.jsx       # Your connections
│   ├── Profile.jsx           # Loads the user and renders EditProfile
│   ├── EditProfile.jsx       # Profile form with live card preview
│   └── EditPassword.jsx      # Change password form
├── hooks/
│   └── useFetchUser.js       # Restores the logged-in user on page load
└── utils/
    ├── constants.js          # BASE_URL and the backend's default photo URL
    ├── photo.js              # hasPhoto and getInitial helpers
    ├── appStore.js           # Redux store
    ├── userSlice.js          # Logged-in user
    ├── feedSlice.js          # Feed users
    ├── requestsSlice.js      # Received connection requests
    └── connectionsSlice.js   # Connections
```

## Routes

All pages render inside the `Body` layout, so the navbar and footer appear on every page.

| Path                | Page                     |
| ------------------- | ------------------------ |
| `/`                 | Home (feed)              |
| `/login`            | Login                    |
| `/profile`          | Edit profile             |
| `/profile/password` | Change password          |
| `/requests`         | Connection requests      |
| `/connections`      | Connections              |

## Backend API used

| Method | Endpoint                               | Used for                    |
| ------ | -------------------------------------- | --------------------------- |
| POST   | `/login`                               | Log in                      |
| POST   | `/logout`                              | Log out                     |
| GET    | `/profile/view`                        | Load the logged-in user     |
| PATCH  | `/profile/edit`                        | Save profile                |
| PATCH  | `/profile/password`                    | Change password             |
| GET    | `/feed`                                | Feed users                  |
| POST   | `/request/send/:status/:userId`        | Ignore or Interested        |
| GET    | `/user/requests/received`              | Received requests           |
| POST   | `/request/review/:status/:requestId`   | Accept or Reject            |
| GET    | `/user/connections`                    | Connections                 |

All requests send the auth cookie with `withCredentials: true`.

## Styling

- The custom daisyUI theme `pairly` is defined in `src/index.css`: rose `primary`, violet `secondary`, white cards on a softly tinted `base-200` background, and a dark `neutral` footer.
- Components use theme colors (`btn-primary`, `bg-base-200`, `from-primary to-secondary`), so changing the theme in `index.css` restyles the whole app.

## Next steps

- Signup page
- Chat with connections
- Dark mode toggle
- Deployment
