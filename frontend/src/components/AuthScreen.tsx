import { FormEvent, useEffect, useState } from "react";
import { BookOpen, Loader2, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen({ hasUsers, onAdminLogin }: { hasUsers: boolean; onAdminLogin: () => void }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(hasUsers ? "login" : "register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMode(hasUsers ? "login" : "register"); }, [hasUsers]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (mode === "register") {
        await register(fullName, email, password);
        setMode("login");
        setPassword("");
        setMessage("Account created. Sign in with your email and password.");
      } else {
        await login(email, password);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to complete this request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-5 text-slate-100">
      <section className="glass w-full max-w-md p-7 md:p-9">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/15 p-3 text-purple-200"><BookOpen size={24} /></div>
          <div>
            <p className="text-xs font-semibold text-purple-300">JAVA MASTERY</p>
            <h1 className="text-2xl font-bold mt-1">{mode === "register" ? "Create your account" : "Welcome back"}</h1>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-4">
          {mode === "register" ? "Register to save your learning progress and quiz scores." : "Sign in to continue your Java learning."}
        </p>

        {message && <p role="status" className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 mt-5 text-sm text-green-200">{message}</p>}
        {error && <p role="alert" className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 mt-5 text-sm text-red-200">{error}</p>}

        <form onSubmit={submit} className="space-y-4 mt-6">
          {mode === "register" && (
            <label className="block text-sm">
              Full name
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required minLength={2} maxLength={100} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-500" />
            </label>
          )}
          <label className="block text-sm">
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required maxLength={320} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-500" />
          </label>
          <label className="block text-sm">
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 8 : 1} maxLength={mode === "register" ? 72 : 100} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-500" />
            {mode === "register" && <span className="text-xs text-slate-500 mt-1 block">Use at least 8 characters.</span>}
          </label>
          <button disabled={loading} className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 py-3 font-semibold">
            {loading ? <Loader2 size={17} className="inline mr-2 animate-spin" /> : mode === "register" ? <UserPlus size={17} className="inline mr-2" /> : <LogIn size={17} className="inline mr-2" />}
            {mode === "register" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          {mode === "register" ? "Already registered?" : "New to Java Mastery?"}{" "}
          <button type="button" onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); setMessage(""); }} className="text-purple-300 hover:text-purple-200 font-semibold">
            {mode === "register" ? "Sign in" : "Create an account"}
          </button>
        </p>
        <p className="text-center mt-5">
          <button type="button" onClick={onAdminLogin} className="text-xs text-slate-500 hover:text-purple-200">
            Admin login
          </button>
        </p>
      </section>
    </main>
  );
}
