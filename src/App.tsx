import { CheckCircle2, Code2, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 md:p-12 selection:bg-emerald-500/20 selection:text-emerald-300">
      <header className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
              Workspace Studio
            </h1>
            <p className="text-xs text-zinc-400">
              React 19 + Vite + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-md">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Dev Server Online</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full my-auto py-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Environment Ready</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
            Your development server is up and running.
          </h2>

          <p className="text-zinc-400 text-base leading-relaxed">
            The project originally contained only an incomplete <code className="text-zinc-200 font-mono text-sm bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">index.html</code> without a build configuration or server setup. It has been initialized with a complete React, Vite, TypeScript, and Tailwind CSS setup listening on port 3000.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Entry Point</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Edit <code className="text-zinc-300 font-mono">src/App.tsx</code> or describe what you want to build next.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Port 3000 Configured</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Vite dev server is bound to <code className="text-zinc-300 font-mono">0.0.0.0:3000</code> with host verification enabled.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 pt-6 flex items-center justify-between text-xs text-zinc-500">
        <span>Ready for your next prompt</span>
        <span className="font-mono">v1.0.0</span>
      </footer>
    </div>
  );
}
