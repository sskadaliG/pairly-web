# pairly-web

The frontend for **Pairly**, a Tinder-inspired app for meeting people. Swipe through a feed of people, send interest, accept or reject requests, and see your connections.

The backend (an Express + MongoDB REST API) lives in a separate `Pairly` project.

## Tech stack

- [React 19](https://react.dev) with the [React Compiler](https://react.dev/learn/react-compiler)
- [Vite](https://vite.dev) for the dev server and builds
- [Tailwind CSS v4](https://tailwindcss.com) for styling
- [daisyUI v5](https://daisyui.com) for UI components, with a custom `pairly` theme
- [React Router v7](https://reactrouter.com) for client-side routing
- [Redux Toolkit](https://redux-toolkit.js.org) and React Redux for app state
- [Axios](https://axios-http.com) for API calls
- [Motion](https://motion.dev) for the swipe animations
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

- **Signup** with the required fields (name, email, password, gender) and validation that matches the backend. After signing up, you're logged in automatically and taken to your profile, with a welcome message and a "Skip for now" link to the feed.
- **Login** with form validation and server error messages.
- **Forgot and reset password**: request a reset link by email, then set a new password from the link. In development, the backend prints the link in its terminal instead of emailing it.
- **Stay logged in** after a refresh: the app loads the user from the cookie, or sends you to the login page. Login, signup, forgot password and reset password are open to logged-out users.
- **Swipe feed** showing one person at a time:
  - Drag the card right for Interested or left for Ignore. The card tilts and shows an INTERESTED or NOPE label as you drag.
  - Swipe past 100px, or flick quickly, to send. A shorter drag springs back.
  - The Ignore and Interested buttons fly the card off the same way.
  - The next person waits underneath and moves forward after each swipe. A new batch loads when the feed runs out.
- **Connection requests** from people interested in you, with Accept and Reject buttons.
- **Connections** list of people you've matched with.
- **Edit profile** with a live preview of your card.
- **Change password** with a confirmation check.
- **Initial avatars**: people without a photo get the first letter of their name.
- **Navbar** with a welcome message and a profile dropdown (Edit profile, Edit password, Connections, Requests, Logout).
- **Dark mode** toggle in the navbar. The choice is remembered, and the first visit follows the system setting.

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
│   ├── Signup.jsx            # Signup form, then auto login and go to profile
│   ├── ForgotPassword.jsx    # Request a password reset link
│   ├── ResetPassword.jsx     # Set a new password from the reset link
│   ├── Feed.jsx              # Home page: loads the feed, stacks the current and next card
│   ├── SwipeCard.jsx         # Draggable card with tilt, labels and Ignore / Interested
│   ├── UserCard.jsx          # Reusable person card; buttons passed as children
│   ├── Requests.jsx          # Received requests with Accept / Reject
│   ├── Connections.jsx       # Your connections
│   ├── Profile.jsx           # Loads the user, welcome banner for new users
│   ├── EditProfile.jsx       # Profile form with live card preview
│   └── EditPassword.jsx      # Change password form
├── hooks/
│   ├── useFetchUser.js       # Restores the logged-in user; redirects to login except on public pages
│   └── useTheme.js           # Light / dark theme toggle
└── utils/
    ├── constants.js          # BASE_URL and the backend's default photo URL
    ├── photo.js              # hasPhoto and getInitial helpers
    ├── validation.js         # Form validation for login, signup, forgot and reset password
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
| `/signup`           | Sign up                  |
| `/forgot-password`  | Forgot password          |
| `/reset-password`   | Reset password (`?token=` from the reset link) |
| `/profile`          | Edit profile             |
| `/profile/password` | Change password          |
| `/requests`         | Connection requests      |
| `/connections`      | Connections              |

## Backend API used

| Method | Endpoint                               | Used for                    |
| ------ | -------------------------------------- | --------------------------- |
| POST   | `/signup`                              | Create an account           |
| POST   | `/login`                               | Log in (also after signup)  |
| POST   | `/logout`                              | Log out                     |
| POST   | `/forgot-password`                     | Request a reset link        |
| POST   | `/reset-password`                      | Set a new password          |
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
- A matching dark theme, `pairly-dark`, keeps the same brand colors on dark backgrounds.
- Components use theme colors (`btn-primary`, `bg-base-200`, `from-primary to-secondary`), so changing the theme in `index.css` restyles the whole app, in both light and dark mode.
- A small script in `index.html` sets the theme before the page draws, so dark mode doesn't flash white on load.

## Next steps

- Chat with connections
- Send password reset links by email (the backend only logs them for now)
- Deployment
