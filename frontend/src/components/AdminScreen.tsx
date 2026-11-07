import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw, ShieldCheck, Users, LogIn, Trophy, LogOut, Trash2 } from "lucide-react";
import {
  Account,
  deleteLocalUser,
  getAdminSession,
  getAdminSnapshot,
  loginAdmin,
  logoutAdmin,
} from "../lib/api";

export default function AdminScreen({ onBack }: { onBack: () => void }) {
  const [admin, setAdmin] = useState<Account | null>(() => getAdminSession());
  const [snapshot, setSnapshot] = useState({ users: [], logins: [], quizResults: [] } as Awaited<ReturnType<typeof getAdminSnapshot>>);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  async function refresh() {
    try { setSnapshot(await getAdminSnapshot()); setError(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load admin data."); }
  }
  useEffect(() => { if (admin) void refresh(); }, [admin?.id]);

  const averageScore = useMemo(() => snapshot.quizResults.length
    ? (snapshot.quizResults.reduce((sum, result) => sum + result.score, 0) / snapshot.quizResults.length).toFixed(1)
    : "—", [snapshot.quizResults]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const account = await loginAdmin(email, password);
      setAdmin(account);
      setPassword("");
      setSnapshot(await getAdminSnapshot());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in to the admin page.");
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    void logoutAdmin();
    setAdmin(null);
  }

  function confirmDelete(userId: string) {
    void deleteLocalUser(userId).then(() => refresh()).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to delete user."));
    setDeleteCandidate(null);
    setNotice("User and their local quiz and learning records were deleted. Their login will no longer work.");
  }

  if (!admin) {
    return (
      <main className="min-h-screen flex items-center justify-center p-5 text-slate-100">
        <section className="glass w-full max-w-md p-7 md:p-9">
          <button onClick={onBack} className="text-sm text-slate-400 hover:text-white mb-6">
            <ArrowLeft size={15} className="inline mr-2" />Back to student sign in
          </button>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/15 p-3 text-purple-200"><ShieldCheck size={24} /></div>
            <div>
              <p className="text-xs font-semibold text-purple-300">JAVA MASTERY ADMIN</p>
              <h1 className="text-2xl font-bold mt-1">Admin sign in</h1>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-4">Sign in to view local learner activity.</p>
          <p className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 mt-4 text-xs leading-5 text-yellow-100">
            This local app keeps user and quiz records in a backend file on this computer. Start the backend before signing in.
          </p>
          {error && <p role="alert" className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 mt-4 text-sm text-red-200">{error}</p>}
          <form onSubmit={submit} className="space-y-4 mt-5">
            <label className="block text-sm">Admin ID<input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-500" /></label>
            <label className="block text-sm">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required maxLength={72} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-500" /></label>
            <button disabled={busy} className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 py-3 font-semibold">
              {busy ? "Please wait..." : "Sign in as admin"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-xs text-purple-300">JAVA MASTERY ADMIN</p>
            <h1 className="text-3xl font-bold mt-1">Admin dashboard</h1>
            <p className="text-sm text-slate-400 mt-2">Signed in as {admin.email}. Local browser records only.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void refresh()} className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"><RefreshCw size={15} className="inline mr-2" />Refresh</button>
            <button onClick={signOut} className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"><LogOut size={15} className="inline mr-2" />Sign out</button>
          </div>
        </header>

        {error && <p role="alert" className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200">{error}</p>}

        {notice && <p role="status" className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200">{notice}</p>}

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Registered users", value: snapshot.users.length, Icon: Users },
            { label: "User sign-ins", value: snapshot.logins.length, Icon: LogIn },
            { label: "Quiz attempts", value: snapshot.quizResults.length, Icon: Trophy },
            { label: "Average score", value: averageScore, Icon: ShieldCheck },
          ].map(({ label, value, Icon }) => <section className="glass p-5" key={label}><Icon size={20} className="text-purple-300" /><p className="text-sm text-slate-400 mt-4">{label}</p><p className="text-3xl font-bold mt-1">{value}</p></section>)}
        </div>

        <section className="glass p-5">
          <h2 className="text-xl font-bold">Registered users</h2>
          {snapshot.users.length ? <div className="overflow-x-auto mt-4"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Registered</th><th className="py-2">Action</th></tr></thead><tbody>{snapshot.users.map((user) => <tr key={user.id} className="border-t border-white/10"><td className="py-3 pr-4">{user.fullName}</td><td className="py-3 pr-4">{user.email}</td><td className="py-3 pr-4 text-slate-400">{new Date(user.createdAt).toLocaleString()}</td><td className="py-3">{deleteCandidate === user.id ? <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-red-200">Delete account and all records?</span><button onClick={() => confirmDelete(user.id)} className="rounded bg-red-600 px-2 py-1 text-xs">Confirm</button><button onClick={() => setDeleteCandidate(null)} className="rounded bg-slate-700 px-2 py-1 text-xs">Cancel</button></div> : <button onClick={() => { setNotice(""); setDeleteCandidate(user.id); }} className="text-xs text-red-300 hover:text-red-200"><Trash2 size={14} className="inline mr-1" />Delete</button>}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-400 mt-3">No student accounts yet.</p>}
        </section>

        <section className="glass p-5">
          <h2 className="text-xl font-bold">Recent sign-ins</h2>
          {snapshot.logins.length ? <div className="overflow-x-auto mt-4"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th className="py-2 pr-4">Email</th><th className="py-2">Signed in</th></tr></thead><tbody>{snapshot.logins.slice(0, 50).map((login) => <tr key={login.id} className="border-t border-white/10"><td className="py-3 pr-4">{login.email}</td><td className="py-3 text-slate-400">{new Date(login.loggedAt).toLocaleString()}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-400 mt-3">No sign-ins recorded yet.</p>}
        </section>

        <section className="glass p-5">
          <h2 className="text-xl font-bold">Quiz results</h2>
          {snapshot.quizResults.length ? <div className="overflow-x-auto mt-4"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Topic</th><th className="py-2 pr-4">Score</th><th className="py-2">Date</th></tr></thead><tbody>{snapshot.quizResults.slice(0, 100).map((result) => <tr key={result.id} className="border-t border-white/10"><td className="py-3 pr-4">{result.userEmail}</td><td className="py-3 pr-4">{result.topicTitle}</td><td className="py-3 pr-4 text-green-200">{result.score}/{result.totalQuestions}</td><td className="py-3 text-slate-400">{new Date(result.attemptedAt).toLocaleString()}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-400 mt-3">No quiz results recorded yet.</p>}
        </section>
      </div>
    </main>
  );
}
