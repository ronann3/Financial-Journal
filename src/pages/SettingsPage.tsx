import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    firstName: "",
    salary: "",
    goalAmount: "",
    goalDate: "",
    journalTime: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings((prev) => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
      }
    };

    loadSettings();
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
    if (!settings.journalTime) return "Journal time is required";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      await setDoc(doc(db, "Users", user.uid), {
        ...settings,
        userSetupComplete: true,
        updatedAt: new Date(),
      });

      navigate("/journal");
    } catch (error) {
      console.error("Error saving settings to Firestore:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-900">
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
          className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
