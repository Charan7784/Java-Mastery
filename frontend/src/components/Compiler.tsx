
import { useState } from "react";
import {
  Play,
  RotateCcw,
  Terminal,
  Code2,
  Loader2,
  Copy,
  Check,
  Server
} from "lucide-react";

const API_URL = "http://localhost:8080/api/compile";

const STARTER_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java Mastery!");

        int a = 10;
        int b = 20;

        System.out.println("Sum = " + (a + b));
    }
}`;

interface CompileResponse {
  output?: string;
  status?: string;
  message?: string;
}

export default function Compiler() {
  const [code, setCode] = useState(STARTER_CODE);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState(
    "Your Java program output will appear here."
  );
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function runCode() {
    if (!code.trim()) {
      setOutput("Please enter some Java code first.");
      return;
    }

    setLoading(true);
    setStatus("Compiling...");
    setOutput("Submitting your Java program...");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sourceCode: code,
          stdin: stdin
        })
      });

      const data: CompileResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Compiler request failed."
        );
      }

      setOutput(
        data.output?.trim()
          ? data.output
          : data.message || "Program executed with no output."
      );

      setStatus(data.status || "Completed");

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown error occurred.";

      setOutput(
        "Unable to execute the program.\n\n" +
        message +
        "\n\nCheck that your Spring Boot backend is running " +
        "and the Judge0 compiler is configured."
      );

      setStatus("Error");

    } finally {
      setLoading(false);
    }
  }

  function resetCode() {
    setCode(STARTER_CODE);
    setStdin("");
    setOutput("Your Java program output will appear here.");
    setStatus("Ready");
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setOutput("Unable to copy code. Please select and copy it manually.");
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="glass p-6">
        <div className="flex flex-wrap justify-between items-center gap-4">

          <div>
            <div className="flex items-center gap-2 text-purple-300">
              <Code2 size={20} />
              <span className="text-sm font-semibold">
                JAVA DEVELOPMENT ENVIRONMENT
              </span>
            </div>

            <h2 className="text-3xl font-bold mt-2">
              Java Code Playground
            </h2>

            <p className="text-gray-400 mt-2 text-sm">
              Write, compile and execute Java programs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Server size={17} className="text-blue-400" />
            <span className="text-gray-400">
              Backend: localhost:8080
            </span>
          </div>

        </div>
      </div>

      {/* TOOLBAR */}
      <div className="glass p-4 flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span className="font-semibold text-sm">
            Main.java
          </span>
          <span className="text-xs text-gray-500">
            Java 17+
          </span>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={runCode}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 font-semibold text-sm"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Play size={17} />
            )}
            {loading ? "Running..." : "Run Java"}
          </button>

        </div>
      </div>

      {/* CODE EDITOR */}
      <section className="glass overflow-hidden">

        <div className="px-5 py-3 border-b border-white/10 flex justify-between">
          <span className="text-sm text-gray-400">
            Source Code
          </span>

          <span className="text-xs text-gray-500">
            Main.java
          </span>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="w-full min-h-[420px] resize-y bg-[#080D19] text-green-300 p-5 outline-none font-mono text-sm leading-7"
          placeholder="Write your Java code here..."
        />

      </section>

      {/* STANDARD INPUT */}
      <section className="glass p-5">

        <div className="flex items-center gap-2 mb-3">
          <Terminal size={18} className="text-blue-400" />
          <h3 className="font-semibold">
            Custom Input (stdin)
          </h3>
        </div>

        <textarea
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder={"Enter input for Scanner here...\nExample:\n10\n20"}
          className="w-full min-h-[100px] bg-[#080D19] text-blue-200 p-4 rounded-xl outline-none font-mono text-sm resize-y"
        />

      </section>

      {/* OUTPUT */}
      <section className="glass overflow-hidden">

        <div className="p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <Terminal size={19} className="text-green-400" />

            <h3 className="font-semibold">
              Program Output
            </h3>
          </div>

          <span className={`text-xs px-3 py-1 rounded-full ${
            status === "Error"
              ? "bg-red-500/20 text-red-300"
              : status === "Ready"
              ? "bg-slate-700 text-gray-300"
              : "bg-green-500/20 text-green-300"
          }`}>
            {status}
          </span>

        </div>

        <pre className="min-h-[180px] whitespace-pre-wrap break-words bg-[#050912] p-5 text-sm text-green-300 font-mono leading-7">
          {output}
        </pre>

      </section>

      {/* INFORMATION */}
      <div className="glass p-4 text-sm text-gray-400 leading-6">
        <strong className="text-purple-300">
          How execution works:
        </strong>

        <p className="mt-2">
          Your browser sends source code and input to the Spring Boot
          backend. The backend forwards it to a configured Judge0
          compatible compiler service and returns the result.
        </p>

        <p className="mt-2 text-yellow-300">
          The compiler requires a configured API key. It will not
          execute programs until the backend and compiler provider
          are configured.
        </p>

      </div>

    </div>
  );
}
