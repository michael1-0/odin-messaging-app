import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <main className="w-full max-w-2xl space-y-4 text-center">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="text-base opacity-80">You are logged in.</p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 text-sm font-medium bg-black text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Log out
        </button>
      </main>
    </div>
  );
}

export default Home;
