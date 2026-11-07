
import { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Code2,
  Brain,
  FolderKanban,
  Search,
  CheckCircle2,
  Menu,
  X,
  Bookmark,
  ChevronRight,
  Trophy,
  Target,
  Clock,
  BookMarked,
  CircleHelp,
  ExternalLink,
  LogOut,
  ShieldCheck
} from "lucide-react";

import { modules, topics } from "./data/syllabus";

import {
  stringProblems,
  arrayProblems
} from "./data/practice";

import { makeLesson } from "./data/lessonFactory";
import { projectGuides } from "./data/projects";

import ProjectCard from "./components/ProjectCard";
import Quiz from "./components/Quiz";
import Visualizer from "./components/Visualizer";
import AuthScreen from "./components/AuthScreen";
import AdminScreen from "./components/AdminScreen";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import { getAdminSession, getLearningData, saveLearningData } from "./lib/api";

type Page =
  | "Dashboard"
  | "Curriculum"
  | "Notes"
  | "Practice"
  | "Projects"
  | "Quizzes"
  | "Visual Learning"
  | "Progress"
  | "Bookmarks";

const navigation: {
  name: Page;
  icon: typeof LayoutDashboard;
}[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Curriculum", icon: BookOpen },
  { name: "Notes", icon: GraduationCap },
  { name: "Practice", icon: Code2 },
  { name: "Projects", icon: FolderKanban },
  { name: "Quizzes", icon: CircleHelp },
  { name: "Visual Learning", icon: Brain },
  { name: "Progress", icon: Trophy },
  { name: "Bookmarks", icon: Bookmark }
];

function PracticeProblemList({ title, problems }: { title: string; problems: readonly string[] }) {
  return (
    <section className="glass p-5">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {problems.map((problem, index) => {
        const query = encodeURIComponent(problem);
        return (
          <div key={problem} className="flex flex-wrap items-center justify-between gap-3 p-3 border-b border-white/5 text-sm">
            <span><span className="text-purple-300 mr-2">{index + 1}.</span>{problem}</span>
            <span className="flex gap-2">
              <a href={`https://leetcode.com/problemset/?search=${query}`} target="_blank" rel="noreferrer" className="rounded-md bg-slate-800 px-2 py-1 text-xs text-purple-200 hover:bg-slate-700">
                LeetCode <ExternalLink size={12} className="inline ml-1" />
              </a>
              <a href={`https://www.geeksforgeeks.org/search/?q=${query}`} target="_blank" rel="noreferrer" className="rounded-md bg-slate-800 px-2 py-1 text-xs text-green-200 hover:bg-slate-700">
                GeeksforGeeks <ExternalLink size={12} className="inline ml-1" />
              </a>
            </span>
          </div>
        );
      })}
    </section>
  );
}

export default function App() {

  const { user, loading: authLoading, hasUsers, logout } = useAuth();

  const [page, setPage] = useState<Page>("Dashboard");
  const [showAdmin, setShowAdmin] = useState(() => Boolean(getAdminSession()));

  const [topicId, setTopicId] = useState(
    topics[0]?.id ?? ""
  );

  const [search, setSearch] = useState("");

  const [mobileMenu, setMobileMenu] = useState(false);

  const [completed, setCompleted] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [learningLoaded, setLearningLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setCompleted([]);
      setBookmarks([]);
      setLearningLoaded(true);
      return;
    }
    setLearningLoaded(false);
    let active = true;
    getLearningData().then((data) => {
      if (active) { setCompleted(data.completedTopicIds); setBookmarks(data.bookmarkedTopicIds); }
    }).catch(() => { if (active) { setCompleted([]); setBookmarks([]); } })
      .finally(() => { if (active) setLearningLoaded(true); });
    return () => { active = false; };
  }, [user?.id]);

  const currentTopic =
    topics.find((topic) => topic.id === topicId) ?? topics[0];

  const lesson = makeLesson(currentTopic);

  const filteredTopics = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return topics;

    return topics.filter((topic) =>
      `${topic.title} ${topic.moduleTitle}`
        .toLowerCase()
        .includes(value)
    );
  }, [search]);

  const progress = topics.length
    ? Math.round((completed.length / topics.length) * 100)
    : 0;

  function navigate(nextPage: Page) {
    setPage(nextPage);
    setMobileMenu(false);
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openTopic(id: string) {
    setTopicId(id);
    navigate("Notes");
  }

  function toggleComplete(id: string) {
    const updated = completed.includes(id)
      ? completed.filter((item) => item !== id)
      : [...completed, id];

    setCompleted(updated);
    if (user) void saveLearningData(user.id, { completedTopicIds: updated, bookmarkedTopicIds: bookmarks }).catch(console.error);
  }

  function toggleBookmark(id: string) {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((item) => item !== id)
      : [...bookmarks, id];

    setBookmarks(updated);
    if (user) void saveLearningData(user.id, { completedTopicIds: completed, bookmarkedTopicIds: updated }).catch(console.error);
  }

  const completedTopic = completed.includes(currentTopic.id);

  if (authLoading) return <LoadingScreen />;
  if (!user) return showAdmin
    ? <AdminScreen onBack={() => setShowAdmin(false)} />
    : <AuthScreen hasUsers={hasUsers} onAdminLogin={() => setShowAdmin(true)} />;
  if (!learningLoaded) return <LoadingScreen message="Loading your saved progress..." />;

  return (
    <div className="min-h-screen text-slate-100 lg:flex">

      {/* SIDEBAR */}

      <aside
        className={`${
          mobileMenu
            ? "fixed inset-0 z-50 flex"
            : "hidden"
        } lg:flex lg:flex-col lg:w-72 lg:shrink-0
        bg-[#10172A] border-r border-white/10 p-5`}
      >

        {/* BRAND */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-2xl font-black gradient-text">
              JAVA MASTERY
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              From Zero to Advanced Java Developer
            </p>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenu(false)}
          >
            <X size={22} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="space-y-2">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.name)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl
                  transition text-left ${
                    page === item.name
                      ? "bg-purple-600/20 text-purple-200 border border-purple-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Icon size={19} />

                <span className="text-sm font-medium">
                  {item.name}
                </span>

                {item.name === "Bookmarks" && (
                  <span className="ml-auto text-xs">
                    {bookmarks.length}
                  </span>
                )}

              </button>
            );

          })}

        </nav>

        <div className="mt-auto space-y-3">
        <div className="glass p-4">
          <p className="text-xs text-slate-400">SIGNED IN</p>
          <p className="font-semibold mt-1 truncate">{user?.fullName}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          <button onClick={() => void logout()} className="text-sm text-purple-200 mt-3 hover:text-white">
            <LogOut size={15} className="inline mr-2" />Sign out
          </button>
          <button onClick={() => { logout(); setShowAdmin(true); }} className="block text-sm text-slate-400 mt-2 hover:text-purple-200">
            <ShieldCheck size={15} className="inline mr-2" />Switch to admin
          </button>
        </div>

        {/* PROGRESS CARD */}

        <div className="glass p-4">

          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" />

            <span className="font-semibold text-sm">
              Your Progress
            </span>
          </div>

          <div className="text-3xl font-bold mt-3">
            {progress}%
          </div>

          <div className="h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 mt-2">
            {completed.length} of {topics.length} topics completed
          </p>

        </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 min-w-0 p-4 md:p-8 max-w-[1600px] mx-auto w-full">

        {/* HEADER */}

        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">

          <div className="flex items-center gap-3">

            <button
              className="lg:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={24} />
            </button>

            <div>
              <p className="text-sm text-slate-400">
                Learning Workspace / {page}
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mt-1">
                {page}
              </h2>
            </div>

          </div>

          {/* SEARCH */}

          <div className="relative w-full md:w-80">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Java topics..."
              className="w-full bg-slate-900 border border-slate-700
                rounded-xl py-3 pl-10 pr-3 outline-none
                focus:border-purple-500"
            />

            {search && (
              <div className="absolute z-20 top-full mt-2 w-full
                bg-[#151B2D] border border-white/10 rounded-xl
                max-h-72 overflow-auto shadow-xl">

                {filteredTopics.slice(0, 10).map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => openTopic(topic.id)}
                    className="block w-full text-left p-3
                      hover:bg-purple-500/10 text-sm"
                  >
                    <div>{topic.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {topic.moduleTitle}
                    </div>
                  </button>
                ))}

                {filteredTopics.length === 0 && (
                  <p className="p-4 text-sm text-slate-400">
                    No topics found.
                  </p>
                )}

              </div>
            )}

          </div>

        </header>

        {/* DASHBOARD */}

        {page === "Dashboard" && (

          <div className="space-y-6">

            <section className="glass p-7 md:p-10">

              <div className="text-purple-300 text-sm font-semibold">
                YOUR JAVA DEVELOPER JOURNEY
              </div>

              <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
                Master Java.
                <br />
                <span className="gradient-text">
                  Build Real Projects.
                </span>
              </h2>

              <p className="text-slate-400 mt-5 max-w-2xl leading-7">
                Learn Java from the fundamentals to advanced
                concepts. Practise coding, understand program
                execution, and build real-world applications.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">

                <button
                  onClick={() => navigate("Curriculum")}
                  className="bg-purple-600 hover:bg-purple-500
                    px-5 py-3 rounded-xl font-semibold"
                >
                  Explore Curriculum
                  <ChevronRight size={17} className="inline ml-2" />
                </button>

                <button
                  onClick={() => navigate("Quizzes")}
                  className="bg-slate-800 hover:bg-slate-700
                    px-5 py-3 rounded-xl"
                >
                  <CircleHelp size={16} className="inline mr-2" />
                  Take a Quiz
                </button>

              </div>

            </section>

            {/* STATISTICS */}

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">

              {[
                {
                  title: "Java Modules",
                  value: modules.length,
                  icon: BookOpen
                },
                {
                  title: "Total Topics",
                  value: topics.length,
                  icon: GraduationCap
                },
                {
                  title: "Completed Topics",
                  value: completed.length,
                  icon: CheckCircle2
                },
                {
                  title: "Bookmarks",
                  value: bookmarks.length,
                  icon: Bookmark
                }
              ].map((item) => {

                const Icon = item.icon;

                return (
                  <div className="glass p-5" key={item.title}>

                    <Icon size={22} className="text-purple-300" />

                    <p className="text-sm text-slate-400 mt-4">
                      {item.title}
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      {item.value}
                    </p>

                  </div>
                );

              })}

            </div>

            {/* CONTINUE LEARNING */}

            <section className="glass p-6">

              <div className="flex justify-between items-center mb-5">

                <h3 className="text-xl font-bold">
                  Continue Learning
                </h3>

                <button
                  onClick={() => navigate("Curriculum")}
                  className="text-purple-300 text-sm"
                >
                  View all
                </button>

              </div>

              <button
                onClick={() => openTopic(currentTopic.id)}
                className="w-full text-left bg-slate-900/70
                  hover:bg-purple-500/10 p-5 rounded-xl"
              >

                <p className="text-xs text-purple-300">
                  MODULE {currentTopic.moduleId}
                </p>

                <h4 className="text-xl font-bold mt-2">
                  {currentTopic.title}
                </h4>

                <p className="text-sm text-slate-400 mt-2">
                  {currentTopic.moduleTitle}
                </p>

                <p className="text-purple-300 text-sm mt-4">
                  Continue learning →
                </p>

              </button>

            </section>

            {/* LEARNING SHORTCUTS */}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

              <button
                onClick={() => navigate("Visual Learning")}
                className="glass p-5 text-left hover:border-purple-500/40"
              >
                <Brain className="text-purple-300" size={25} />
                <h3 className="font-bold mt-4">Learn Visually</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Understand Java concepts through animations.
                </p>
              </button>

              <button
                onClick={() => navigate("Practice")}
                className="glass p-5 text-left hover:border-purple-500/40"
              >
                <Target className="text-blue-300" size={25} />
                <h3 className="font-bold mt-4">Coding Practice</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Practise String and Array problems.
                </p>
              </button>

              <button
                onClick={() => navigate("Projects")}
                className="glass p-5 text-left hover:border-purple-500/40"
              >
                <FolderKanban className="text-green-300" size={25} />
                <h3 className="font-bold mt-4">Java Projects</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Build practical Java applications.
                </p>
              </button>

              <button
                onClick={() => navigate("Quizzes")}
                className="glass p-5 text-left hover:border-purple-500/40"
              >
                <CircleHelp className="text-yellow-300" size={25} />
                <h3 className="font-bold mt-4">Topic Quizzes</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Check your understanding with 10 questions per topic.
                </p>
              </button>

            </div>

          </div>

        )}

        {/* CURRICULUM */}

        {page === "Curriculum" && (

          <div className="space-y-5">

            <section className="glass p-5">
              <h3 className="text-xl font-bold">
                Complete Java Roadmap
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                18 modules covering Core Java and Advanced Java.
              </p>
            </section>

            {modules.map((module) => (

              <section className="glass p-5" key={module.id}>

                <div className="flex flex-wrap justify-between gap-3">

                  <div>
                    <p className="text-xs text-purple-300">
                      MODULE {String(module.id).padStart(2, "0")}
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                      {module.title}
                    </h3>
                  </div>

                  <span className="text-xs text-slate-400">
                    {module.topics.length} topics
                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-2 mt-5">

                  {module.topics.map((title) => {

                    const topic = topics.find(
                      (item) =>
                        item.moduleId === module.id &&
                        item.title === title
                    );

                    if (!topic) return null;

                    return (
                      <button
                        key={topic.id}
                        onClick={() => openTopic(topic.id)}
                        className="text-left rounded-lg p-3 bg-slate-900/70
                          hover:bg-purple-500/10 flex items-center
                          justify-between gap-2"
                      >

                        <span className="text-sm">
                          {title}
                        </span>

                        {completed.includes(topic.id) && (
                          <CheckCircle2
                            size={17}
                            className="text-green-400 shrink-0"
                          />
                        )}

                      </button>
                    );

                  })}

                </div>

                <div className="mt-5 text-sm text-slate-400">
                  Mini Project:
                  <span className="text-purple-300 ml-2">
                    {module.project}
                  </span>
                </div>

              </section>

            ))}

          </div>

        )}

        {/* NOTES */}

        {page === "Notes" && (

          <div className="grid xl:grid-cols-[280px_1fr] gap-5">

            {/* TOPIC SIDEBAR */}

            <aside className="glass p-4 h-fit max-h-[75vh] overflow-auto">

              <h3 className="font-bold mb-4">
                All Java Topics
              </h3>

              {filteredTopics.map((topic) => (

                <button
                  key={topic.id}
                  onClick={() => setTopicId(topic.id)}
                  className={`block w-full text-left p-3
                    rounded-lg text-sm ${
                      topicId === topic.id
                        ? "bg-purple-500/20 text-purple-200"
                        : "text-slate-400 hover:bg-white/5"
                    }`}
                >
                  {topic.moduleId}. {topic.title}
                </button>

              ))}

            </aside>

            {/* LESSON CONTENT */}

            <article className="space-y-4 min-w-0">

              <section className="glass p-6">

                <div className="text-sm text-purple-300">
                  MODULE {currentTopic.moduleId}
                  {" · "}
                  {currentTopic.moduleTitle}
                </div>

                <div className="flex justify-between gap-3 mt-3">

                  <h2 className="text-3xl font-bold">
                    {currentTopic.title}
                  </h2>

                  <button
                    onClick={() => toggleBookmark(currentTopic.id)}
                    title="Bookmark topic"
                  >
                    <Bookmark
                      className={
                        bookmarks.includes(currentTopic.id)
                          ? "text-yellow-300 fill-yellow-300"
                          : "text-slate-500"
                      }
                    />
                  </button>

                </div>

                <p className="text-xs text-amber-300 mt-4">
                  {lesson.note}
                </p>

              </section>

              {[
                ["Definition", lesson.definition],
                ["Why this concept is important", lesson.why],
                ["How it works", lesson.working],
                ["Java Syntax", lesson.syntax],
                ["Java Program", lesson.program],
                ["Expected Output", lesson.output],
                ["Program Dry Run", lesson.dryRun.join("\n")],
                [
                  "Interview Questions",
                  lesson.interview
                    .map((q, i) => `${i + 1}. ${q}`)
                    .join("\n")
                ],
                [
                  "Practice Exercises",
                  lesson.exercise
                    .map((q, i) => `${i + 1}. ${q}`)
                    .join("\n")
                ]
              ].map(([heading, content]) => (

                <section className="glass p-5" key={heading}>

                  <h3 className="text-lg font-bold mb-4">
                    {heading}
                  </h3>

                  <pre className="whitespace-pre-wrap break-words
                    font-sans text-slate-300 leading-7 text-sm">
                    {content}
                  </pre>

                </section>

              ))}

              <button
                onClick={() => toggleComplete(currentTopic.id)}
                className={`px-5 py-3 rounded-xl flex items-center gap-2 ${
                  completedTopic
                    ? "bg-slate-700"
                    : "bg-green-700 hover:bg-green-600"
                }`}
              >

                <CheckCircle2 size={18} />

                {completedTopic
                  ? "Mark as not completed"
                  : "Mark Topic as Completed"}

              </button>

            </article>

          </div>

        )}

        {/* PRACTICE */}

        {page === "Practice" && (

          <div className="space-y-5">

            <section className="glass p-5">
              <h3 className="text-xl font-bold">
                Java Coding Practice
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Choose a problem, then open its search on LeetCode or GeeksforGeeks.
              </p>
            </section>

            <div className="grid lg:grid-cols-2 gap-5">
              <PracticeProblemList title="String Problems" problems={stringProblems} />
              <PracticeProblemList title="Array Problems" problems={arrayProblems} />
            </div>

          </div>

        )}

        {/* PROJECTS */}

        {page === "Projects" && (

          <div className="space-y-5">

            <section className="glass p-5">
              <h3 className="text-xl font-bold">
                Java Projects: Build Notes and Code
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Open any project for a step-by-step build guide and Java starter code.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-5">
              {projectGuides.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>

          </div>

        )}

        {page === "Quizzes" && <Quiz />}

        {/* VISUAL LEARNING */}

        {page === "Visual Learning" && (
          <Visualizer />
        )}

        {/* PROGRESS */}

        {page === "Progress" && (

          <div className="space-y-5">

            <section className="glass p-6">

              <h3 className="text-2xl font-bold">
                Your Learning Progress
              </h3>

              <div className="text-5xl font-black gradient-text mt-5">
                {progress}%
              </div>

              <div className="h-3 bg-slate-800 rounded-full mt-5 overflow-hidden">

                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />

              </div>

              <p className="text-slate-400 text-sm mt-3">
                {completed.length} of {topics.length} topics completed.
              </p>

            </section>

            {modules.map((module) => {

              const moduleTopics = topics.filter(
                (topic) => topic.moduleId === module.id
              );

              const finished = moduleTopics.filter(
                (topic) => completed.includes(topic.id)
              ).length;

              const percentage = moduleTopics.length
                ? Math.round(
                    (finished / moduleTopics.length) * 100
                  )
                : 0;

              return (

                <section className="glass p-5" key={module.id}>

                  <div className="flex justify-between gap-3">

                    <h3 className="font-bold">
                      {module.title}
                    </h3>

                    <span className="text-purple-300 text-sm">
                      {percentage}%
                    </span>

                  </div>

                  <div className="h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">

                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${percentage}%` }}
                    />

                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    {finished}/{moduleTopics.length} topics
                  </p>

                </section>

              );

            })}

          </div>

        )}

        {/* BOOKMARKS */}

        {page === "Bookmarks" && (

          <section className="glass p-6">

            <div className="flex items-center gap-3 mb-5">

              <BookMarked
                size={23}
                className="text-yellow-300"
              />

              <h3 className="text-xl font-bold">
                Your Bookmarked Topics
              </h3>

            </div>

            {topics
              .filter((topic) => bookmarks.includes(topic.id))
              .map((topic) => (

                <div
                  key={topic.id}
                  className="flex items-center justify-between gap-3
                    p-4 border-b border-white/5"
                >

                  <button
                    onClick={() => openTopic(topic.id)}
                    className="text-left"
                  >

                    <p className="font-semibold">
                      {topic.title}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {topic.moduleTitle}
                    </p>

                  </button>

                  <button
                    onClick={() => toggleBookmark(topic.id)}
                    className="text-red-300 text-xs"
                  >
                    Remove
                  </button>

                </div>

              ))}

            {bookmarks.length === 0 && (
              <p className="text-slate-400">
                No bookmarks yet. Open a lesson and click the bookmark icon.
              </p>
            )}

          </section>

        )}

        {/* FOOTER */}

        <footer className="text-center text-xs text-slate-500 mt-12 mb-5">

          JAVA MASTERY © 2026

          <p className="mt-2">
            Learn · Practise · Visualize · Build
          </p>

        </footer>

      </main>

    </div>
  );
}
