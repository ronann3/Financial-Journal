import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("🎉 Account created successfully!");
      }

      const userSetupComplete = localStorage.getItem("userSetupComplete");
      if (userSetupComplete) {
        navigate("/journal"); // returning user
      } else {
        navigate("/settings"); // first-time user
      }
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {isLogin ? "Login" : "Register"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-green-900 mt-3 text-sm cursor-pointer text-center hover:underline"
        >
          {isLogin
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}
