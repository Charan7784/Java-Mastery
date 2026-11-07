import { useState } from "react";
import { Check, ChevronDown, Clipboard, FolderKanban } from "lucide-react";
import type { ProjectGuide } from "../data/projects";

export default function ProjectCard({ project }: { project: ProjectGuide }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(project.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="glass p-5">
      <div className="flex items-center gap-2 text-xs text-purple-300">
        <FolderKanban size={15} />{project.moduleTitle.toUpperCase()}
      </div>
      <h3 className="text-xl font-bold mt-3">{project.title}</h3>
      <p className="text-sm text-slate-400 leading-6 mt-3">{project.summary}</p>
      <button
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="text-purple-200 text-sm mt-4"
      >
        {expanded ? "Hide project guide" : "Open build notes and code"}
        <ChevronDown size={16} className={`inline ml-2 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="mt-5 space-y-5 border-t border-white/10 pt-5">
          <div>
            <h4 className="font-semibold">How to build it</h4>
            <ol className="list-decimal pl-5 mt-3 space-y-2 text-sm text-slate-300 leading-6">
              {project.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h4 className="font-semibold">Java starter code</h4>
              <button onClick={copyCode} className="rounded-lg bg-slate-800 px-3 py-2 text-xs hover:bg-slate-700">
                {copied ? <Check size={14} className="inline mr-1" /> : <Clipboard size={14} className="inline mr-1" />}
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre rounded-xl bg-[#050912] p-4 text-xs leading-6 text-green-200">{project.code}</pre>
          </div>
        </div>
      )}
    </section>
  );
}
