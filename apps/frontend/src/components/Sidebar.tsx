import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

type User = {
  id: number;
  username: string;
};

type Chat = {
  id: number;
  createdBy: User;
  user1: User;
  user2: User;
};

type ChatActivityEvent = CustomEvent<{ roomId: number }>;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const currentUserId = Number(localStorage.getItem("userId"));

  const [chats, setChats] = useState<Array<Chat>>([]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const [userIdAdd, setUserIdAdd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    (async function fetchRoomsByUserId() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}rooms`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        setChats(data);
      } catch {
        setError("There was an error trying to fetch rooms");
      }
    })();
  }, [token]);

  useEffect(() => {
    function handleChatActivity(event: Event) {
      const chatActivityEvent = event as ChatActivityEvent;
      const roomId = chatActivityEvent.detail?.roomId;

      if (!roomId) {
        return;
      }

      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex((chat) => chat.id === roomId);

        if (chatIndex <= 0) {
          return prevChats;
        }

        const targetChat = prevChats[chatIndex];
        return [
          targetChat,
          ...prevChats.slice(0, chatIndex),
          ...prevChats.slice(chatIndex + 1),
        ];
      });
    }

    window.addEventListener("chat:activity", handleChatActivity);

    return () => {
      window.removeEventListener("chat:activity", handleChatActivity);
    };
  }, []);

  async function handleFormSubmit(e: React.SubmitEvent<HTMLElement>) {
    e.preventDefault();

    if (!userIdAdd) {
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user2Id: Number(userIdAdd),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Invalid");
        return;
      }

      console.log(data);

      setChats((prevChats) => [data, ...prevChats]);
      setIsChatModalOpen(false);
      navigate(`/chats/${data.id}`);
    } catch {
      setError("There was an error trying to add user");
    } finally {
      setLoading(false);
    }
  }

  function checkChatWithCurrentUserId(chat: Chat, currentUserId: number) {
    const checked = currentUserId === chat.user1.id ? chat.user2 : chat.user1;
    return `${checked.username} #${checked.id}`;
  }

  function modalReset() {
    setError("");
    setUserIdAdd("");
    setIsChatModalOpen(false);
  }

  const isProfile = location.pathname === "/profile";
  const isHome = location.pathname === "/";
  const isUsers = location.pathname === "/users";

  return (
    <>
      <aside className="h-full w-64 border-l border-neutral-200 bg-neutral-50 p-4 shrink-0 flex flex-col overflow-y-auto">
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
              onClick={() => navigate("/")}
              className={`w-full text-left text-sm px-3 py-2 border-l-2 transition-colors cursor-pointer ${
                isHome
                  ? "border-black bg-transparent text-black font-semibold"
                  : "border-transparent bg-transparent text-neutral-600 hover:text-black hover:border-neutral-400"
              }`}
            >
              Global Chat
            </button>
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
              onClick={() => navigate("/users")}
              className={`w-full text-left text-sm px-3 py-2 border-l-2 transition-colors cursor-pointer ${
                isUsers
                  ? "border-black bg-transparent text-black font-semibold"
                  : "border-transparent bg-transparent text-neutral-600 hover:text-black hover:border-neutral-400"
              }`}
            >
              Users
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
            {chats.length > 0 &&
              chats.map((chat: Chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left px-4 py-2 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/chats/${chat.id}`)}
                >
                  {checkChatWithCurrentUserId(chat, currentUserId)}
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
            <form onSubmit={(e) => handleFormSubmit(e)}>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
                  {error}
                </p>
              )}
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Paste their user ID here"
                onChange={(e) => setUserIdAdd(e.target.value)}
                value={userIdAdd}
              />
              <div className="mt-4 flex justify-end gap-2">
                <button className="px-3 py-2 text-sm text-neutral-100 rounded border bg-black border-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer">
                  {loading ? "Adding user..." : "Add"}
                </button>
                <button
                  onClick={() => modalReset()}
                  className="px-3 py-2 text-sm rounded border border-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
