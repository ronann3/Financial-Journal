import NavBar from "../components/NavBar";

export default function JournalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-green-100">
      <NavBar />
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl font-bold mb-4">Journal Page</h1>
        <p className="mb-6">Your journal will go here.</p>
      </div>
    </div>
  );
}
