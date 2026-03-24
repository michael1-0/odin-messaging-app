import { Outlet } from "react-router";

function App() {
  return (
    <div className="w-full min-h-dvh flex">
      <Outlet />
    </div>
  );
}

export default App;
