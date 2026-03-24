import { useNavigate } from "react-router";

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <aside className="w-64 border-l border-neutral-200 bg-neutral-50 p-4 shrink-0 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-semibold text-lg">App</h2>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 bg-black text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Log out
        </button>
      </div>
      <nav className="flex-1">{/* Navigation */}</nav>
    </aside>
  );
}

export default Sidebar;
