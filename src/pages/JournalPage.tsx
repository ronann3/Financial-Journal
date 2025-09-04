import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import NavBar from "../components/NavBar";
import { getFunctions, httpsCallable } from "firebase/functions";

interface PurchaseCase {
  id: string;
  name: string;
  category?: string;
  note?: string;
  [key: string]: any;
}

interface UserSettings {
  firstName: string;
  salary: string;
  goalAmount: string;
  goalDate: string;
  journalTime: string;
  userSetupComplete?: boolean;
  [key: string]: any;
}

interface FinancialFeedbackResponse {
  feedback: string;
}

export default function JournalPage() {
  const [cases, setCases] = useState<PurchaseCase[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn("No logged-in user");
          setLoading(false);
          return;
        }

        const userDocSnap = await getDoc(doc(db, "Users", user.uid));
        if (userDocSnap.exists()) {
          setSettings(userDocSnap.data() as UserSettings);
        }

        const snapshot = await getDocs(collection(db, "Purchase-Cases"));
        const caseList: PurchaseCase[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.id,
          price: doc.data().Price || 0,
          category: doc.data().category || "Unknown",
          note: doc.data().note || "Unknown",
        }));
        setCases(caseList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    id: string,
    field: "category" | "note",
    value: string
  ) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              [field]: value,
            }
          : c
      )
    );
  };

  const functions = getFunctions(undefined, "us-west1");
  const getAiFeedback = httpsCallable<any, FinancialFeedbackResponse>(
    functions,
    "getFinancialFeedback"
  );

  const handleFeedbackRequest = async () => {
    if (!settings || cases.length === 0) {
      alert(
        "Please ensure all transactions are noted and user settings are complete."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const result = await getAiFeedback({ cases, settings });
      setFeedback(result.data.feedback);
    } catch (error) {
      console.error("Failed to get AI feedback:", error);
      setFeedback("An error occurred while getting feedback.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-100">
      <NavBar />
      <div className="flex flex-col items-start justify-start flex-1 w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Journal Page</h1>

        {loading ? (
          <p>Loading...</p>
        ) : cases.length > 0 ? (
          <div className="flex flex-col space-y-4 w-full max-w-md">
            {cases.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-white rounded shadow w-full flex flex-col space-y-3"
              >
                {/* Display the ID string as the title */}
                <p className="text-lg font-bold">{c.id}</p>

                {/* Always show Category and Note with label alignment */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-24 font-semibold text-gray-700">
                      Category:
                    </span>
                    <input
                      type="text"
                      value={c.category}
                      onChange={(e) =>
                        handleInputChange(c.id, "category", e.target.value)
                      }
                      className="flex-1 border p-2 rounded w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-24 font-semibold text-gray-700">
                      Note:
                    </span>
                    <input
                      type="text"
                      value={c.note}
                      onChange={(e) =>
                        handleInputChange(c.id, "note", e.target.value)
                      }
                      className="flex-1 border p-2 rounded w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleFeedbackRequest}
              disabled={isGenerating}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Get AI Feedback"}
            </button>
            {feedback && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md whitespace-pre-line">
                <h2 className="text-xl font-bold mb-2">
                  AI Financial Feedback 🤖
                </h2>
                {feedback}
              </div>
            )}
          </div>
        ) : (
          <p>No Purchase-Cases found.</p>
        )}
      </div>
    </div>
  );
}
