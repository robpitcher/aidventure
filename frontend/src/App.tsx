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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Aidventure</h2>
            <p className="text-gray-600 mb-4">
              Your AI-powered companion for adventure race packing preparation.
            </p>
            <div className="flex gap-4">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-md transition-colors">
                Create Checklist
              </button>
              <button className="bg-accent-600 hover:bg-accent-700 text-white font-medium px-6 py-2 rounded-md transition-colors">
                AI Assist
              </button>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🎉 Project Successfully Scaffolded!
            </h3>
            <p className="text-blue-800">
              React + Vite + TypeScript + Tailwind CSS is now configured and ready to use.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
