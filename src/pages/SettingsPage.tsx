import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    firstName: "",
    salary: "",
    goalAmount: "",
    goalDate: "",
    journalTime: "", // user picks in browser time input
  });

  // Load existing settings if returning user
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      const data = JSON.parse(stored);
      setSettings((prev) => ({ ...prev, ...data }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!settings.firstName.trim()) return "Name is required";
    if (Number(settings.salary) <= 0) return "Salary must be >0";
    if (Number(settings.goalAmount) <= 0) return "Goal Amount must be >0";
    if (!settings.goalDate || new Date(settings.goalDate) <= new Date())
      return "Goal Date must be in the future";

    // No strict format validation for journalTime
    if (!settings.journalTime) return "Journal time is required";

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in");
      return;
    }

    // Save settings locally
    const existing = localStorage.getItem("userData");
    const userData = existing ? JSON.parse(existing) : {};
    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...userData,
        firstName: settings.firstName,
        salary: settings.salary,
        goalAmount: settings.goalAmount,
        goalDate: settings.goalDate,
        journalTime: settings.journalTime,
        userSetupComplete: "true",
      })
    );

    localStorage.setItem("userName", settings.firstName);

    navigate("/journal");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Setup Settings</h2>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={settings.firstName}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={settings.salary}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="number"
          name="goalAmount"
          placeholder="Goal Amount"
          value={settings.goalAmount}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="date"
          name="goalDate"
          value={settings.goalDate}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="time"
          name="journalTime"
          value={settings.journalTime}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
