import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function NavBar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      navigate("/auth");
    } catch (err: any) {
      alert("Error signing out: " + err.message);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/settings" className="text-shadow-green-900 hover:underline">
          Settings
        </Link>
        <Link to="/journal" className="text-shadow-green-900 hover:underline">
          Journal
        </Link>
        <Link to="/summary" className="text-shadow-green-900 hover:underline">
          Summary
        </Link>
      </div>
      <button
        onClick={handleSignOut}
        className="bg-green-900 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      >
        Sign Out
      </button>
    </nav>
  );
}
