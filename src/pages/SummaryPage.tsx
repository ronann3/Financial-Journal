import NavBar from "../components/NavBar";

export default function SummaryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-yellow-100">
      <NavBar />
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl font-bold mb-4">Summary Page</h1>
        <p className="mb-6">Your summary will go here.</p>
      </div>
    </div>
  );
}
