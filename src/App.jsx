import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Body from "./components/Body";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import EditPassword from "./components/EditPassword";
import Requests from "./components/Requests";
import Connections from "./components/Connections";

// Loaded only when a chat is opened. Chat brings socket.io-client with it,
// so people who never open a chat never download that code.
const Chat = lazy(() => import("./components/Chat"));

// Shown while a lazy page's code is downloading
const PageLoading = () => (
  <div className="flex flex-1 items-center justify-center">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
);

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
            <Route
              path="/chat/:userId"
              element={
                <Suspense fallback={<PageLoading />}>
                  <Chat />
                </Suspense>
              }
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
