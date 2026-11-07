import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, CircleHelp, RotateCcw } from "lucide-react";
import { topicQuizzes } from "../data/quizzes";
import { useAuth } from "../context/AuthContext";
import { getQuizResults, QuizResult, saveQuizResult } from "../lib/api";

export default function Quiz() {
  const { user } = useAuth();
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [results, setResults] = useState<QuizResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    getQuizResults(user.id).then((savedResults) => {
      if (!active) return;
      setResults(savedResults);
      const latestScores: Record<number, number> = {};
      savedResults.forEach((result) => { if (latestScores[result.moduleId] === undefined) latestScores[result.moduleId] = result.score; });
      setScores(latestScores); setError("");
    }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Unable to load saved results."); });
    return () => { active = false; };
  }, [user?.id]);

  const activeQuiz = topicQuizzes.find((quiz) => quiz.moduleId === openModule);
  const score = activeQuiz
    ? activeQuiz.questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0)
    : 0;

  function openQuiz(moduleId: number) {
    setOpenModule((current) => current === moduleId ? null : moduleId);
    setAnswers({});
    setSubmitted(false);
    setError("");
  }

  async function submitQuiz() {
    if (!activeQuiz || !user || Object.keys(answers).length !== activeQuiz.questions.length) return;
    setError("");
    try {
      const saved = await saveQuizResult(user, activeQuiz.moduleId, score, activeQuiz.questions.length);
      setResults((current) => [saved, ...current].slice(0, 100));
      setScores((current) => ({ ...current, [saved.moduleId]: saved.score }));
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save your result. Please try again.");
    }
  }

  return (
    <div className="space-y-5">
      <section className="glass p-6">
        <div className="flex items-center gap-3 text-purple-300">
          <CircleHelp size={23} />
          <span className="text-sm font-semibold">JAVA TOPIC QUIZZES</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-3">Check what you know</h2>
        <p className="text-sm text-slate-400 mt-2">
          Each topic has 10 questions. Quiz attempts are saved to the account for {user?.email}.
        </p>
      </section>

      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {topicQuizzes.map((quiz) => (
          <button
            key={quiz.moduleId}
            onClick={() => openQuiz(quiz.moduleId)}
            className={`glass p-5 text-left hover:border-purple-500/50 ${openModule === quiz.moduleId ? "border-purple-500/60" : ""}`}
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <span className="text-xs text-purple-300">TOPIC {quiz.moduleId}</span>
                <h3 className="font-bold mt-2">{quiz.title}</h3>
                <p className="text-xs text-slate-400 mt-2">10 questions</p>
              </div>
              {scores[quiz.moduleId] !== undefined && (
                <span className="text-sm text-green-300">Latest: {scores[quiz.moduleId]}/10</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-200 mt-4">
              {openModule === quiz.moduleId ? "Close quiz" : "Start quiz"}
              <ChevronDown size={16} className={openModule === quiz.moduleId ? "rotate-180" : ""} />
            </div>
          </button>
        ))}
      </div>

      {activeQuiz && (
        <section className="glass p-5 md:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-purple-300">TOPIC {activeQuiz.moduleId} QUIZ</p>
              <h3 className="text-xl font-bold mt-1">{activeQuiz.title}</h3>
            </div>
            <button
              onClick={() => { setAnswers({}); setSubmitted(false); setError(""); }}
              className="px-3 py-2 rounded-lg bg-slate-800 text-sm hover:bg-slate-700"
            >
              <RotateCcw size={15} className="inline mr-2" />Restart
            </button>
          </div>

          {activeQuiz.questions.map((question, questionIndex) => (
            <article key={`${activeQuiz.moduleId}-${questionIndex}`} className="border-t border-white/10 pt-5">
              <h4 className="font-semibold">
                <span className="text-purple-300 mr-2">{questionIndex + 1}.</span>{question.question}
              </h4>
              <div className="grid md:grid-cols-3 gap-2 mt-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[questionIndex] === optionIndex;
                  const isCorrect = question.answer === optionIndex;
                  const resultStyle = submitted
                    ? isCorrect ? "border-green-500/70 bg-green-500/10 text-green-200" : isSelected ? "border-red-500/70 bg-red-500/10 text-red-200" : "border-white/10 text-slate-400"
                    : isSelected ? "border-purple-500/70 bg-purple-500/10 text-purple-100" : "border-white/10 text-slate-300 hover:border-purple-500/40";
                  return (
                    <button
                      key={option}
                      disabled={submitted}
                      onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                      className={`rounded-lg border px-3 py-2 text-sm text-left ${resultStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {submitted && <p className="text-xs text-slate-400 mt-2">{question.explanation}</p>}
            </article>
          ))}

          {!submitted ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length !== activeQuiz.questions.length}
                className="rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500 disabled:opacity-40"
              >Submit answers</button>
              <span className="text-sm text-slate-400">{Object.keys(answers).length} of 10 answered</span>
            </div>
          ) : (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-100">
              <CheckCircle2 size={18} className="inline mr-2" />You scored {score} out of 10. This attempt is saved to your account.
            </div>
          )}
        </section>
      )}

      <section className="glass p-5">
        <h3 className="text-lg font-bold">Your recent quiz results</h3>
        {results.length === 0 ? (
          <p className="text-sm text-slate-400 mt-3">Your saved attempts will appear here.</p>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th className="py-2 pr-4">Topic</th><th className="py-2 pr-4">Score</th><th className="py-2">Date</th></tr></thead>
              <tbody>{results.slice(0, 10).map((result) => (
                <tr key={result.id} className="border-t border-white/10">
                  <td className="py-3 pr-4">{result.topicTitle}</td>
                  <td className="py-3 pr-4 text-green-200">{result.score}/{result.totalQuestions}</td>
                  <td className="py-3 text-slate-400">{new Date(result.attemptedAt).toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
