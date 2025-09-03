import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function NavBar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.clear(); // clears all user data
      navigate("/auth"); // redirect to AuthPage
    } catch (err: any) {
      alert("Error signing out: " + err.message);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/settings" className="text-blue-600 hover:underline">
          Settings
        </Link>
        <Link to="/journal" className="text-blue-600 hover:underline">
          Journal
        </Link>
        <Link to="/summary" className="text-blue-600 hover:underline">
          Summary
        </Link>
      </div>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        Sign Out
      </button>
    </nav>
  );
}
