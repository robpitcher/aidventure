import { ChecklistDemo } from './components/ChecklistDemo';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold">Aidventure</h1>
          <p className="text-primary-100 mt-1">AI Adventure Racing Assistant</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ChecklistDemo />
      </main>
    </div>
  );
}

export default App;
