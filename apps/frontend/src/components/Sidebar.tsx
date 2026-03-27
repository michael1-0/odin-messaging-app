import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const placeholderChats = ["SUBJECT #1", "SUBJECT #2", "SUBJECT #3"];
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  useEffect(() => {
    if (isChatModalOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
  }, [isChatModalOpen]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  const isProfile = location.pathname === "/profile";
  const isHome = location.pathname === "/";

  return (
    <>
      <aside className="w-64 border-l border-neutral-200 bg-neutral-50 p-4 shrink-0 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-semibold text-md">odin-messaging-app</h2>
          <button
            onClick={handleLogout}
            className="text-xs px-2.5 py-1.5 bg-black text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-6">
          <div className="space-y-2">
            <button
              onClick={() => navigate("/profile")}
              className={`w-full text-left text-sm px-3 py-2 border-l-2 transition-colors cursor-pointer ${
                isProfile
                  ? "border-black bg-transparent text-black font-semibold"
                  : "border-transparent bg-transparent text-neutral-600 hover:text-black hover:border-neutral-400"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/")}
              className={`w-full text-left text-sm px-3 py-2 border-l-2 transition-colors cursor-pointer ${
                isHome
                  ? "border-black bg-transparent text-black font-semibold"
                  : "border-transparent bg-transparent text-neutral-600 hover:text-black hover:border-neutral-400"
              }`}
            >
              Global Chat
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase text-neutral-500">
                Chats
              </h3>
              <button
                onClick={() => setIsChatModalOpen(true)}
                className="text-xs px-2.5 py-1.5 rounded bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Add New Chat
              </button>
            </div>
            {placeholderChats.map((chatName) => (
              <button
                key={chatName}
                className="w-full text-left text-sm px-3 py-2 rounded bg-white border border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                {chatName}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {isChatModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setIsChatModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-lg p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Create New Chat</h3>
            <p className="text-sm text-neutral-600">
              This modal is currently visual-only.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsChatModalOpen(false)}
                className="px-3 py-2 text-sm rounded border border-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
