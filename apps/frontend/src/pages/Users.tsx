import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";

type UsersResponse = {
  id: number;
  username: string;
  noteToAll: string;
  createdAt: string;
};

function Users() {
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const [users, setUsers] = useState<Array<UsersResponse>>([]);
  const [onlineUsersCount, setOnlineUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    socketRef.current = io(import.meta.env.VITE_SERVER_URL, {
      auth: { token },
      autoConnect: false,
    });

    socketRef.current.on("users:online-count", (count: number) => {
      setOnlineUsersCount(count);
    });

    socketRef.current.connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    (async function loadUsers() {
      setError("");
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await res.json()) as UsersResponse[] | { error?: string };

        if (!res.ok) {
          setError("Could not load users.");
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
          }
          return;
        }

        setUsers(data as UsersResponse[]);
      } catch {
        setError("Could not load users.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  function formatAccountDate(rawDate: string) {
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return rawDate;

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="flex w-full min-h-dvh bg-gray-50">
      <main className="flex flex-1 items-center justify-center overflow-y-auto p-6">
        <div className="w-full max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Users</h1>
            <p className="rounded bord px-3 py-1 text-sm font-medium text-green-700">
              Online now: {onlineUsersCount}
            </p>
          </div>

          <div>
            {loading ? (
              <p className="text-sm text-neutral-600">Loading users...</p>
            ) : (
              <>
                {error && (
                  <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                  </p>
                )}

                {!error && users.length === 0 && (
                  <p className="text-sm text-neutral-600">No users found.</p>
                )}

                {!error && users.length > 0 && (
                  <ul className="space-y-3">
                    {users.map((user) => (
                      <li
                        key={user.id}
                        className="rounded border border-neutral-200 p-4 bg-white"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-neutral-900">
                              {user.username} with an id of {user.id}
                            </p>
                          </div>
                          <p className="text-xs text-neutral-500 whitespace-nowrap">
                            Joined {formatAccountDate(user.createdAt)}
                          </p>
                        </div>

                        <p className="mt-3 text-sm text-neutral-700">
                          {user.noteToAll?.trim()
                            ? user.noteToAll
                            : "No public note yet."}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Users;
