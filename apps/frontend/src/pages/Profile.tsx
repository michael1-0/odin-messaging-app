import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ProfileUpdateSchema } from "@repo/zod-validations";

type MeResponse = {
  id: number;
  email: string;
  username: string;
  noteToAll: string;
  createdAt: string;
};

function Profile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [noteToAll, setNoteToAll] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setError("");
      setLoadingProfile(true);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = (await res.json()) as MeResponse;

        if (!res.ok) {
          setError("Could not load your profile.");
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
          }
          return;
        }

        setEmail(data.email ?? "");
        setUserId(data.id ?? null);
        setCreatedAt(data.createdAt ?? null);
        setUsername(data.username ?? "");
        setNoteToAll(data.noteToAll ?? "");
      } catch {
        setError("Could not load your profile.");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [navigate]);

  async function copyIdToClipboard() {
    if (userId === null) return;
    await navigator.clipboard.writeText(String(userId));
  }

  function formatAccountDate(rawDate: string) {
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return rawDate;

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = ProfileUpdateSchema.safeParse({ username, noteToAll });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, noteToAll }),
      });
      const data = (await res.json()) as Partial<MeResponse> & {
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Could not update profile");
        return;
      }

      setUsername(data.username ?? username);
      setNoteToAll(data.noteToAll ?? noteToAll);
      setSuccess("Profile updated");
    } catch {
      setError("Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <main className="flex flex-1 items-center justify-center overflow-y-auto p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-6">Profile</h1>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            {loadingProfile ? (
              <p className="text-sm text-neutral-600">Loading profile...</p>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                    {success}
                  </p>
                )}

                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full border rounded px-3 py-2 text-sm bg-neutral-100 text-neutral-600"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="noteToAll"
                    className="block text-sm font-medium"
                  >
                    Note to all
                  </label>
                  <textarea
                    id="noteToAll"
                    value={noteToAll}
                    onChange={(e) => setNoteToAll(e.target.value)}
                    rows={4}
                    className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                    placeholder="Say hi to everyone"
                  />
                  {userId !== null && (
                    <p className="pt-1 text-right text-xs text-neutral-600">
                      You have an id of {userId},{" "}
                      <button
                        type="button"
                        onClick={() => copyIdToClipboard()}
                        className="underline hover:text-neutral-900 cursor-pointer"
                      >
                        click here
                      </button>{" "}
                      to copy and share your id.
                    </p>
                  )}
                  {createdAt && (
                    <p className="pt-1 text-right text-xs text-neutral-600">
                      Account created on {formatAccountDate(createdAt)}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save profile"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
