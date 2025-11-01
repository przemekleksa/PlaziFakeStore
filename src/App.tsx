import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Platzi Fake Store
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            React 18 + TypeScript + Vite + Tailwind CSS
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Project Setup Complete! 🎉
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>✅ React 18 with TypeScript</p>
              <p>✅ Vite build tool</p>
              <p>✅ Tailwind CSS with dark mode</p>
              <p>✅ ESLint + Prettier configuration</p>
              <p>✅ Project structure ready</p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                Next steps: Install dependencies and start development server
              </p>
              <code className="block mt-2 text-sm text-blue-700 dark:text-blue-300">
                npm install && npm run dev
              </code>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;