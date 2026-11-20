import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import useFetchUser from "../hooks/useFetchUser";

// Shown while a page's code is downloading (the lazy pages in App.jsx)
const PageLoading = () => (
  <div className="flex flex-1 items-center justify-center">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
);

const Body = () => {
  useFetchUser();

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <NavBar />
      <main className="flex flex-1 flex-col">
        {/* One Suspense here covers every page, and the navbar and footer stay on screen */}
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Body;
