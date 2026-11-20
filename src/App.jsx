import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Body from "./components/Body";
// The pages people land on first stay normal imports, so they show straight away
import Feed from "./components/Feed";
import Login from "./components/Login";

// Every other page downloads the first time it's opened.
// Body's <Suspense> shows a spinner while that happens.
const Signup = lazy(() => import("./components/Signup"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const Profile = lazy(() => import("./components/Profile"));
const EditPassword = lazy(() => import("./components/EditPassword"));
const Requests = lazy(() => import("./components/Requests"));
const Connections = lazy(() => import("./components/Connections"));
// Chat brings socket.io-client with it
const Chat = lazy(() => import("./components/Chat"));

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Feed />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route path="/reset-password" element={<ResetPassword />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/profile/password" element={<EditPassword />}></Route>
            <Route path="/requests" element={<Requests />}></Route>
            <Route path="/connections" element={<Connections />}></Route>
            <Route path="/chat/:userId" element={<Chat />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
