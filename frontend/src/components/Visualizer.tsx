
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Brain,
  Zap,
  Code2
} from "lucide-react";

interface VisualStep {
  title: string;
  description: string;
  code?: string;
  memory?: string;
}

const demos: Record<string, VisualStep[]> = {

  "JVM Execution": [
    {
      title: "Java Source Code",
      description: "The programmer writes source code in a .java file.",
      code: "Main.java"
    },
    {
      title: "Java Compiler",
      description: "javac checks and compiles the source code.",
      code: "javac Main.java"
    },
    {
      title: "Bytecode Generated",
      description: "The compiler produces a platform-independent class file.",
      code: "Main.class"
    },
    {
      title: "Class Loading",
      description: "The class loader loads the required classes into the JVM.",
      memory: "Class metadata is loaded."
    },
    {
      title: "Bytecode Verification",
      description: "The verifier checks the bytecode for structural and safety rules.",
      memory: "Bytecode verification"
    },
    {
      title: "Execution Engine",
      description: "The JVM interprets bytecode and may use JIT compilation.",
      memory: "Interpreter + JIT compiler"
    },
    {
      title: "Program Output",
      description: "The program executes and produces its result.",
      code: "Hello Java!"
    }
  ],

  "Variables": [
    {
      title: "Declare Variable",
      description: "A variable declaration introduces a name and type.",
      code: "int age;"
    },
    {
      title: "Initialize Variable",
      description: "Assign the value 20 to the variable.",
      code: "int age = 20;"
    },
    {
      title: "Read Variable",
      description: "Java reads the stored value when the variable is used.",
      memory: "age = 20"
    },
    {
      title: "Update Variable",
      description: "Assign a new value to the variable.",
      code: "age = 21;"
    }
  ],

  "Type Casting": [
    {
      title: "Integer Value",
      description: "Start with an integer value.",
      code: "int number = 100;"
    },
    {
      title: "Widening Conversion",
      description: "Java automatically converts int into double.",
      code: "double value = number;"
    },
    {
      title: "Narrowing Conversion",
      description: "An explicit cast converts a double into an int.",
      code: "int result = (int) 10.75;"
    },
    {
      title: "Final Result",
      description: "The fractional portion is discarded during this cast.",
      memory: "result = 10"
    }
  ],

  "Conditions": [
    {
      title: "Start",
      description: "The program receives a value.",
      code: "int age = 20;"
    },
    {
      title: "Check Condition",
      description: "Java evaluates whether age is at least 18.",
      code: "age >= 18"
    },
    {
      title: "True Branch",
      description: "The condition is true, so the if block executes.",
      code: 'System.out.println("Eligible");'
    },
    {
      title: "End",
      description: "Execution continues after the conditional statement.",
      memory: "Eligible"
    }
  ],

  "For Loop": [
    {
      title: "Initialization",
      description: "Initialize the loop counter.",
      code: "int i = 1;"
    },
    {
      title: "Condition",
      description: "Check whether i is less than or equal to 5.",
      code: "i <= 5"
    },
    {
      title: "Execute Body",
      description: "Print the current counter.",
      code: "System.out.println(i);"
    },
    {
      title: "Increment",
      description: "Increase i by one.",
      code: "i++;"
    },
    {
      title: "Repeat",
      description: "Return to the condition and repeat while it is true.",
      memory: "1 → 2 → 3 → 4 → 5"
    },
    {
      title: "Stop",
      description: "When i becomes 6, the condition is false.",
      memory: "Loop completed"
    }
  ],

  "Nested Loops": [
    {
      title: "Outer Loop",
      description: "The outer loop starts with row = 1.",
      code: "for (int row = 1; row <= 3; row++)"
    },
    {
      title: "Inner Loop",
      description: "The inner loop executes for each outer-loop iteration.",
      code: "for (int col = 1; col <= 3; col++)"
    },
    {
      title: "Print Element",
      description: "Print one star for every inner-loop iteration.",
      code: 'System.out.print("* ");'
    },
    {
      title: "Move to Next Row",
      description: "After the inner loop finishes, move to a new line.",
      code: "System.out.println();"
    },
    {
      title: "Complete",
      description: "The two loops produce a 3 by 3 star pattern.",
      memory: "***\n***\n***"
    }
  ],

  "Array Indexing": [
    {
      title: "Create Array",
      description: "Create an integer array containing four elements.",
      code: "int[] arr = {10, 20, 30, 40};",
      memory: "[10, 20, 30, 40]"
    },
    {
      title: "Index Zero",
      description: "Java array indexing starts from zero.",
      code: "arr[0]",
      memory: "Index 0 = 10"
    },
    {
      title: "Index One",
      description: "Access the second array element.",
      code: "arr[1]",
      memory: "Index 1 = 20"
    },
    {
      title: "Last Index",
      description: "The last valid index is length minus one.",
      code: "arr[arr.length - 1]",
      memory: "Index 3 = 40"
    }
  ],

  "Array Insertion": [
    {
      title: "Original Array",
      description: "Start with an array of four elements and one free position.",
      memory: "[10, 20, 30, 40, _]"
    },
    {
      title: "Choose Position",
      description: "Insert 25 at index 2.",
      memory: "Insert 25 at index 2"
    },
    {
      title: "Shift Elements",
      description: "Move existing elements one position to the right.",
      memory: "[10, 20, _, 30, 40]"
    },
    {
      title: "Insert Value",
      description: "Store 25 at the selected position.",
      memory: "[10, 20, 25, 30, 40]"
    }
  ],

  "Array Deletion": [
    {
      title: "Original Array",
      description: "Start with five array elements.",
      memory: "[10, 20, 30, 40, 50]"
    },
    {
      title: "Select Index",
      description: "Delete the element at index 2.",
      memory: "Delete 30"
    },
    {
      title: "Shift Left",
      description: "Move the elements after the deleted value one position left.",
      memory: "[10, 20, 40, 50, _]"
    },
    {
      title: "Update Size",
      description: "The logical array size is reduced by one.",
      memory: "[10, 20, 40, 50]"
    }
  ],

  "Linear Search": [
    {
      title: "Start Search",
      description: "Search for the value 30.",
      memory: "Array: [10, 20, 30, 40]"
    },
    {
      title: "Check Index 0",
      description: "Compare 10 with the target 30.",
      memory: "10 != 30"
    },
    {
      title: "Check Index 1",
      description: "Compare 20 with the target 30.",
      memory: "20 != 30"
    },
    {
      title: "Check Index 2",
      description: "The target value is found.",
      memory: "30 == 30"
    },
    {
      title: "Search Complete",
      description: "Return the matching index.",
      memory: "Found at index 2"
    }
  ],

  "Bubble Sort": [
    {
      title: "Original Array",
      description: "Start with an unsorted array.",
      memory: "[5, 3, 8, 1]"
    },
    {
      title: "Compare First Pair",
      description: "Compare 5 and 3. Swap because 5 is greater.",
      memory: "[3, 5, 8, 1]"
    },
    {
      title: "Compare Second Pair",
      description: "Compare 5 and 8. No swap is needed.",
      memory: "[3, 5, 8, 1]"
    },
    {
      title: "Compare Third Pair",
      description: "Compare 8 and 1. Swap them.",
      memory: "[3, 5, 1, 8]"
    },
    {
      title: "Next Pass",
      description: "Continue comparing adjacent elements.",
      memory: "[3, 1, 5, 8]"
    },
    {
      title: "Sorted Array",
      description: "After the remaining passes, the array is sorted.",
      memory: "[1, 3, 5, 8]"
    }
  ],

  "String Immutability": [
    {
      title: "Create String",
      description: "Create a String object containing Java.",
      code: 'String s = "Java";',
      memory: 's → "Java"'
    },
    {
      title: "Concatenation",
      description: "Concatenation creates a new String value.",
      code: 's = s + " Mastery";',
      memory: 's → "Java Mastery"'
    },
    {
      title: "Original Object",
      description: "The original String object was not modified.",
      memory: 'Original: "Java"'
    },
    {
      title: "New Reference",
      description: "The variable now refers to the new String value.",
      memory: 'Current: "Java Mastery"'
    }
  ],

  "String Pool": [
    {
      title: "First Literal",
      description: "A string literal is placed in the string pool.",
      code: 'String a = "Java";'
    },
    {
      title: "Second Literal",
      description: "The same literal can reuse the pooled object.",
      code: 'String b = "Java";'
    },
    {
      title: "Reference Comparison",
      description: "Both variables refer to the same pooled object.",
      code: "a == b",
      memory: "true"
    },
    {
      title: "New Object",
      description: "Using new String creates a distinct String object.",
      code: 'String c = new String("Java");',
      memory: "a == c is false"
    }
  ],

  "StringBuilder": [
    {
      title: "Create Builder",
      description: "Create a mutable StringBuilder object.",
      code: 'StringBuilder sb = new StringBuilder("Java");'
    },
    {
      title: "Append",
      description: "Append a new word to the existing builder.",
      code: 'sb.append(" Mastery");'
    },
    {
      title: "Mutable Content",
      description: "The builder updates its character sequence.",
      memory: "Java Mastery"
    },
    {
      title: "Convert to String",
      description: "Use toString() to obtain a String value.",
      code: "sb.toString();"
    }
  ],

  "Method Call Stack": [
    {
      title: "Main Method",
      description: "Execution begins in main().",
      memory: "Stack: main()"
    },
    {
      title: "Call Method A",
      description: "main() calls methodA().",
      memory: "Stack: main() → methodA()"
    },
    {
      title: "Call Method B",
      description: "methodA() calls methodB().",
      memory: "Stack: main() → methodA() → methodB()"
    },
    {
      title: "Return",
      description: "methodB() completes and returns.",
      memory: "Stack: main() → methodA()"
    },
    {
      title: "Finish",
      description: "methodA() returns and main() continues.",
      memory: "Stack: main()"
    }
  ],

  "Recursion": [
    {
      title: "Initial Call",
      description: "Start calculating factorial of 3.",
      code: "factorial(3)"
    },
    {
      title: "Recursive Call",
      description: "factorial(3) calls factorial(2).",
      memory: "3 × factorial(2)"
    },
    {
      title: "Next Call",
      description: "factorial(2) calls factorial(1).",
      memory: "2 × factorial(1)"
    },
    {
      title: "Base Condition",
      description: "factorial(1) reaches the base case and returns 1.",
      memory: "1"
    },
    {
      title: "Return Values",
      description: "The stack starts returning values.",
      memory: "2 × 1 = 2"
    },
    {
      title: "Final Result",
      description: "The original call receives its result.",
      memory: "3 × 2 = 6"
    }
  ],

  "Object and Heap": [
    {
      title: "Class Definition",
      description: "A class defines the structure of an object.",
      code: "class Student { int id; }"
    },
    {
      title: "Object Creation",
      description: "The new operator creates an object.",
      code: "Student s = new Student();"
    },
    {
      title: "Heap Allocation",
      description: "The object is allocated in heap memory.",
      memory: "Heap: Student object"
    },
    {
      title: "Reference",
      description: "The variable s stores a reference to the object.",
      memory: "s → Student object"
    }
  ],

  "Constructors": [
    {
      title: "Class",
      description: "A constructor belongs to a class.",
      code: "class Student {"
    },
    {
      title: "Constructor",
      description: "Define a constructor with the class name.",
      code: "Student() { }"
    },
    {
      title: "Create Object",
      description: "The constructor runs during object creation.",
      code: "Student s = new Student();"
    },
    {
      title: "Initialization",
      description: "The constructor initializes object state.",
      memory: "Object created and initialized"
    }
  ],

  "Inheritance": [
    {
      title: "Parent Class",
      description: "Create a parent class with a method.",
      code: "class Animal { void eat() {} }"
    },
    {
      title: "Child Class",
      description: "The child class extends the parent.",
      code: "class Dog extends Animal { }"
    },
    {
      title: "Inherited Method",
      description: "The child can use accessible inherited methods.",
      code: "Dog d = new Dog();"
    },
    {
      title: "Execute Method",
      description: "The child object calls the inherited method.",
      code: "d.eat();"
    }
  ],

  "Polymorphism": [
    {
      title: "Parent Reference",
      description: "Declare a parent type reference.",
      code: "Animal a;"
    },
    {
      title: "Child Object",
      description: "Assign a Dog object to the parent reference.",
      code: "a = new Dog();"
    },
    {
      title: "Overridden Method",
      description: "The child class overrides the parent method.",
      memory: "Dog implementation"
    },
    {
      title: "Dynamic Dispatch",
      description: "The actual object's overridden method executes.",
      code: "a.sound();"
    }
  ],

  "Interfaces": [
    {
      title: "Interface",
      description: "Declare a contract using an interface.",
      code: "interface Printable { void print(); }"
    },
    {
      title: "Implement",
      description: "A class implements the interface.",
      code: "class Report implements Printable"
    },
    {
      title: "Define Method",
      description: "The class supplies the required method implementation.",
      code: "public void print() { }"
    },
    {
      title: "Call Method",
      description: "The interface contract is used through the object.",
      memory: "Report printed"
    }
  ],

  "Exception Handling": [
    {
      title: "Try Block",
      description: "Place code that may throw an exception inside try.",
      code: "try {"
    },
    {
      title: "Exception Occurs",
      description: "An invalid operation throws an exception.",
      code: "int result = 10 / 0;"
    },
    {
      title: "Catch Block",
      description: "A matching catch block handles the exception.",
      code: "catch (ArithmeticException e)"
    },
    {
      title: "Continue",
      description: "After handling, execution continues after the construct.",
      memory: "Exception handled"
    }
  ],

  "Collections HashMap": [
    {
      title: "Create Map",
      description: "Create a HashMap to store key-value pairs.",
      code: "Map<Integer, String> map = new HashMap<>();"
    },
    {
      title: "Insert Entry",
      description: "Add a key and its associated value.",
      code: 'map.put(1, "Java");'
    },
    {
      title: "Insert Another",
      description: "Add another key-value pair.",
      code: 'map.put(2, "Python");'
    },
    {
      title: "Retrieve Value",
      description: "Retrieve a value using its key.",
      code: "map.get(1);",
      memory: "Java"
    }
  ],

  "Multithreading": [
    {
      title: "Create Thread Task",
      description: "Define the work that a thread should perform.",
      code: "Runnable task = () -> System.out.println(\"Run\");"
    },
    {
      title: "Create Thread",
      description: "Create a Thread using the task.",
      code: "Thread t = new Thread(task);"
    },
    {
      title: "Start Thread",
      description: "start() schedules a new thread of execution.",
      code: "t.start();"
    },
    {
      title: "Run Task",
      description: "The new thread executes the run() method.",
      memory: "Thread execution"
    }
  ]

};

const speedOptions = [
  { label: "Slow", value: 1800 },
  { label: "Normal", value: 1000 },
  { label: "Fast", value: 500 }
];

export default function Visualizer() {

  const topicNames = Object.keys(demos);

  const [activeTopic, setActiveTopic] = useState(topicNames[0]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const steps = demos[activeTopic];
  const currentStep = steps[step];

  useEffect(() => {

    if (!playing) return;

    const timer = window.setInterval(() => {

      setStep((current) => {

        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }

        return current + 1;
      });

    }, speed);

    return () => window.clearInterval(timer);

  }, [playing, speed, steps.length]);

  function changeTopic(topic: string) {
    setActiveTopic(topic);
    setStep(0);
    setPlaying(false);
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function reset() {
    setPlaying(false);
    setStep(0);
  }

  function play() {

    if (step === steps.length - 1) {
      setStep(0);
    }

    setPlaying(true);
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="glass p-6">

        <div className="flex items-center gap-2 text-purple-300">
          <Brain size={22} />
          <span className="text-sm font-semibold">
            INTERACTIVE JAVA LEARNING
          </span>
        </div>

        <h2 className="text-3xl font-bold mt-3">
          Learn Java Visually
        </h2>

        <p className="text-gray-400 mt-2">
          Understand how Java executes programs through
          interactive step-by-step demonstrations.
        </p>

      </div>

      {/* TOPIC SELECTION */}

      <section className="glass p-5">

        <label className="block text-sm text-gray-400 mb-3">
          Select a Java concept
        </label>

        <select
          value={activeTopic}
          onChange={(e) => changeTopic(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 p-4 rounded-xl outline-none focus:border-purple-500"
        >

          {topicNames.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}

        </select>

      </section>

      {/* VISUALIZATION */}

      <section className="glass p-6 space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>
            <div className="text-xs text-purple-300">
              CURRENT ANIMATION
            </div>

            <h3 className="text-2xl font-bold mt-1">
              {activeTopic}
            </h3>
          </div>

          <div className="text-sm text-gray-400">
            Step {step + 1} of {steps.length}
          </div>

        </div>

        {/* PROGRESS BAR */}

        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`
            }}
          />

        </div>

        {/* ACTIVE STEP */}

        <div className="min-h-[250px] rounded-2xl bg-[#080D19] border border-purple-500/20 p-6 flex flex-col justify-center items-center text-center">

          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-5">

            <Zap size={28} className="text-purple-300" />

          </div>

          <div className="text-sm text-purple-300 mb-2">
            EXECUTION STEP {step + 1}
          </div>

          <h3 className="text-2xl font-bold">
            {currentStep.title}
          </h3>

          <p className="text-gray-400 mt-4 max-w-xl leading-7">
            {currentStep.description}
          </p>

          {currentStep.memory && (

            <div className="mt-5 w-full max-w-xl bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">

              <div className="text-xs text-purple-300 mb-2">
                MEMORY / STATE
              </div>

              <pre className="whitespace-pre-wrap text-green-300 font-mono text-sm">
                {currentStep.memory}
              </pre>

            </div>

          )}

        </div>

        {/* CODE PREVIEW */}

        {currentStep.code && (

          <div className="bg-black rounded-xl p-5">

            <div className="flex items-center gap-2 mb-3 text-blue-300">

              <Code2 size={17} />

              <span className="text-sm">
                Java Code / Instruction
              </span>

            </div>

            <pre className="whitespace-pre-wrap break-words text-green-300 font-mono text-sm leading-7">
              {currentStep.code}
            </pre>

          </div>

        )}

        {/* CONTROLS */}

        <div className="flex flex-wrap justify-center gap-3">

          <button
            onClick={reset}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center gap-2"
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            onClick={previousStep}
            disabled={step === 0}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center gap-2"
          >
            <ChevronLeft size={17} />
            Previous
          </button>

          <button
            onClick={() => playing ? setPlaying(false) : play()}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center gap-2 font-semibold"
          >
            {playing ? (
              <>
                <Pause size={17} />
                Pause
              </>
            ) : (
              <>
                <Play size={17} />
                Play
              </>
            )}
          </button>

          <button
            onClick={nextStep}
            disabled={step === steps.length - 1}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center gap-2"
          >
            Next
            <ChevronRight size={17} />
          </button>

        </div>

        {/* SPEED */}

        <div className="flex flex-wrap justify-center items-center gap-3">

          <span className="text-sm text-gray-400">
            Animation speed:
          </span>

          {speedOptions.map((option) => (

            <button
              key={option.label}
              onClick={() => setSpeed(option.value)}
              className={`px-4 py-2 rounded-lg text-sm ${
                speed === option.value
                  ? "bg-purple-500/20 border border-purple-400 text-purple-200"
                  : "bg-slate-800 text-gray-400"
              }`}
            >
              {option.label}
            </button>

          ))}

        </div>

      </section>

      {/* COMPLETE STEP LIST */}

      <section className="glass p-5">

        <h3 className="font-bold text-lg mb-4">
          Execution Steps
        </h3>

        <div className="space-y-2">

          {steps.map((item, index) => (

            <button
              key={`${activeTopic}-${index}`}
              onClick={() => {
                setPlaying(false);
                setStep(index);
              }}
              className={`w-full text-left p-4 rounded-xl flex gap-3 items-center transition ${
                index === step
                  ? "bg-purple-500/20 border border-purple-500/40"
                  : "bg-slate-900/60 hover:bg-slate-800"
              }`}
            >

              <div className="w-8 h-8 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-sm">
                {index + 1}
              </div>

              <div>
                <div className="font-semibold text-sm">
                  {item.title}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {item.description}
                </div>
              </div>

            </button>

          ))}

        </div>

      </section>

      <div className="glass p-4 text-sm text-gray-400">
        These are step-by-step conceptual visualizations. The displayed
        steps represent Java execution concepts; they are not a live
        JVM debugger or actual memory inspector.
      </div>

    </div>

  );
}
