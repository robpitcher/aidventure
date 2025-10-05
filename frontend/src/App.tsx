import { ChecklistPage } from './components/checklist/ChecklistPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Aidventure Pack Planner</h1>
              <p className="text-white/80 mt-1">AI Adventure Racing Assistant</p>
            </div>
            <button
              className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Open AI Assist"
            >
              AI Assist (Coming Soon)
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ChecklistPage />
      </main>
    </div>
  );
}

export default App;
