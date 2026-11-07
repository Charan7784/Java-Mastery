export default function LoadingScreen({ message = "Loading your learning space..." }: { message?: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 text-center text-slate-300">
      <div className="glass rounded-2xl px-8 py-6">
        <div className="mx-auto h-8 w-8 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
        <p className="mt-4 text-sm">{message}</p>
      </div>
    </main>
  );
}
