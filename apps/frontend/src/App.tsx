import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "./components/Sidebar";

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setIsSidebarOpen(false);
  }

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative flex w-full min-h-dvh overflow-x-hidden bg-gray-50">
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed right-3 top-3 z-40 inline-flex items-center justify-center rounded-md  p-2 text-neutral-800 sm:hidden"
          aria-label="Open sidebar"
          aria-expanded={isSidebarOpen}
        >
          <span className="text-lg leading-none bg-gray-50 rounded-lg p-2 mr-2">☰</span>
        </button>
      )}

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 sm:hidden">
          <div
            className="absolute inset-0"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            className="absolute right-0 top-0 h-full w-[85vw] max-w-64"
            onClick={(event) => event.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="hidden sm:block">
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
