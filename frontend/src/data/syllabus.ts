
export interface JavaModule {
  id: number;
  title: string;
  topics: string[];
  project: string;
}

export interface JavaTopic {
  id: string;
  title: string;
  moduleId: number;
  moduleTitle: string;
  project: string;
}

export const modules: JavaModule[] = [
  {
    id: 1,
    title: "Introduction to Java",
    topics: [
      "What is Java?",
      "History and evolution of Java",
      "Features of Java",
      "Applications of Java",
      "Java vs C and C++",
      "Object-oriented programming overview",
      "JDK, JRE and JVM",
      "Java bytecode",
      "Platform independence",
      "Java architecture",
      "Java program structure",
      "main() method",
      "Command-line arguments",
      "Installing JDK",
      "Setting PATH",
      "First Java program",
      "Compilation and execution",
      "Comments and Javadoc"
    ],
    project: "Student Profile Generator"
  },
  {
    id: 2,
    title: "Variables and Data Types",
    topics: [
      "Variables and declaration",
      "Initialization",
      "Local variables",
      "Instance variables",
      "Static variables",
      "Primitive data types",
      "Non-primitive data types",
      "Type casting",
      "Widening conversion",
      "Narrowing conversion",
      "Type promotion",
      "final variables",
      "Scope and lifetime",
      "Default values",
      "Memory basics"
    ],
    project: "Student Marks Calculator"
  },
  {
    id: 3,
    title: "Operators",
    topics: [
      "Arithmetic operators",
      "Relational operators",
      "Logical operators",
      "Assignment operators",
      "Unary operators",
      "Increment and decrement",
      "Bitwise operators",
      "Shift operators",
      "Ternary operator",
      "Operator precedence",
      "Associativity"
    ],
    project: "Smart Calculator"
  },
  {
    id: 4,
    title: "Input and Output",
    topics: [
      "print()",
      "println()",
      "printf()",
      "Scanner class",
      "next() and nextLine()",
      "Scanner newline issue",
      "nextInt() and nextDouble()",
      "charAt() for character input",
      "BufferedReader",
      "Input validation"
    ],
    project: "Personal Expense Calculator"
  },
  {
    id: 5,
    title: "Conditional Statements",
    topics: [
      "if statement",
      "if-else",
      "else-if ladder",
      "Nested if",
      "switch statement",
      "Nested switch",
      "break and fall-through",
      "Switch expressions"
    ],
    project: "Electricity Bill Management System"
  },
  {
    id: 6,
    title: "Loops and Number Programs",
    topics: [
      "for loop",
      "while loop",
      "do-while loop",
      "Nested loops",
      "Entry-controlled loops",
      "Exit-controlled loops",
      "Infinite loops",
      "break",
      "continue",
      "Loop tracing and dry runs",
      "Time complexity basics",
      "Natural numbers",
      "Even and odd",
      "Sum of numbers",
      "Factorial",
      "Multiplication table",
      "Reverse a number",
      "Sum of digits",
      "Count digits",
      "Palindrome number",
      "Armstrong number",
      "Prime number",
      "Fibonacci series",
      "GCD",
      "LCM",
      "Strong number",
      "Perfect number",
      "Automorphic number",
      "Neon number",
      "Spy number"
    ],
    project: "Number Analysis Toolkit"
  },
  {
    id: 7,
    title: "Pattern Programming",
    topics: [
      "Square patterns",
      "Right triangle",
      "Inverted triangle",
      "Pyramid",
      "Inverted pyramid",
      "Diamond",
      "Hollow square",
      "Hollow triangle",
      "Number patterns",
      "Floyd's triangle",
      "Alphabet patterns",
      "Butterfly pattern",
      "Rows and columns",
      "Nested-loop dry runs",
      "Space management"
    ],
    project: "Pattern Generator"
  },
  {
    id: 8,
    title: "Arrays",
    topics: [
      "Array introduction",
      "Declaration and initialization",
      "Indexing",
      "Traversal",
      "Enhanced for loop",
      "length property",
      "One-dimensional arrays",
      "Two-dimensional arrays",
      "Multidimensional arrays",
      "Jagged arrays",
      "Array memory",
      "Copying arrays",
      "Arrays utility class",
      "Sorting",
      "Linear search",
      "Binary search",
      "Insertion",
      "Deletion",
      "Rotation",
      "Merging arrays",
      "Duplicates",
      "Frequency counting",
      "Time and space complexity",
      "Sum and average",
      "Maximum and minimum",
      "Second and third largest",
      "Reverse array",
      "Remove duplicates",
      "Missing number",
      "Move zeroes",
      "Two sum",
      "Kadane's algorithm",
      "Leaders in array",
      "Majority element",
      "Prefix sum",
      "Subarrays",
      "Matrix addition",
      "Matrix multiplication",
      "Transpose",
      "Diagonal traversal"
    ],
    project: "ArrayVerse Visualizer"
  },
  {
    id: 9,
    title: "Strings",
    topics: [
      "String creation",
      "String literals",
      "String objects",
      "String immutability",
      "String pool",
      "== vs equals()",
      "equalsIgnoreCase()",
      "length()",
      "charAt()",
      "substring()",
      "concat()",
      "contains()",
      "indexOf() and lastIndexOf()",
      "toUpperCase() and toLowerCase()",
      "trim() and strip()",
      "replace()",
      "split()",
      "startsWith() and endsWith()",
      "StringBuilder",
      "StringBuffer",
      "Thread safety",
      "String performance",
      "Reverse string",
      "Palindrome string",
      "Vowel and consonant count",
      "Word count",
      "Duplicate characters",
      "Character frequency",
      "Remove spaces",
      "Remove duplicate characters",
      "Anagram check",
      "Reverse each word",
      "First non-repeating character",
      "First repeating character",
      "Longest word",
      "Case count",
      "String rotation",
      "Longest common prefix",
      "String compression",
      "Reverse words",
      "Substring occurrences"
    ],
    project: "Text Analyzer"
  },
  {
    id: 10,
    title: "Methods",
    topics: [
      "Method declaration",
      "Method definition and call",
      "Parameters and arguments",
      "Return values",
      "void methods",
      "Static methods",
      "Instance methods",
      "Method overloading",
      "Method overriding introduction",
      "Recursion",
      "Base condition",
      "Call stack",
      "Pass by value",
      "Variable arguments",
      "Scope"
    ],
    project: "Modular Banking Calculator"
  },
  {
    id: 11,
    title: "Classes and Objects",
    topics: [
      "Class definition",
      "Object creation",
      "Fields and methods",
      "Instance members",
      "Static members",
      "Constructors",
      "Default constructor",
      "Parameterized constructor",
      "Constructor overloading",
      "this keyword",
      "this() constructor chaining",
      "Static initialization block",
      "Instance initialization block",
      "Object lifecycle",
      "Stack and heap"
    ],
    project: "Student Management System"
  },
  {
    id: 12,
    title: "Object-Oriented Programming",
    topics: [
      "Encapsulation",
      "Data hiding",
      "Getters and setters",
      "Inheritance",
      "Single inheritance",
      "Multilevel inheritance",
      "Hierarchical inheritance",
      "super keyword",
      "Constructor chaining",
      "Method overriding",
      "Multiple inheritance limitations",
      "Polymorphism",
      "Compile-time polymorphism",
      "Runtime polymorphism",
      "Dynamic method dispatch",
      "Upcasting and downcasting",
      "Abstraction",
      "Abstract classes",
      "Abstract methods",
      "Interfaces",
      "implements keyword",
      "Default and static interface methods",
      "Functional interfaces"
    ],
    project: "Employee Management System"
  },
  {
    id: 13,
    title: "Access Modifiers and Keywords",
    topics: [
      "public access",
      "private access",
      "protected access",
      "default access",
      "static",
      "final",
      "this",
      "super",
      "abstract",
      "extends",
      "implements",
      "new",
      "instanceof",
      "return",
      "synchronized",
      "transient",
      "volatile"
    ],
    project: "Secure User Profile"
  },
  {
    id: 14,
    title: "Packages",
    topics: [
      "Built-in packages",
      "User-defined packages",
      "import statement",
      "Creating packages",
      "Accessing package members",
      "Static import",
      "Package structure",
      "Package access rules"
    ],
    project: "College Management System"
  },
  {
    id: 15,
    title: "Exception Handling",
    topics: [
      "Errors vs exceptions",
      "Exception hierarchy",
      "Checked exceptions",
      "Unchecked exceptions",
      "try block",
      "catch block",
      "Multiple catch blocks",
      "finally block",
      "throw keyword",
      "throws keyword",
      "Custom exceptions",
      "Nested try",
      "Try-with-resources",
      "Exception propagation"
    ],
    project: "ATM Validation System"
  },
  {
    id: 16,
    title: "Wrapper Classes",
    topics: [
      "Wrapper class overview",
      "Integer and other wrappers",
      "Autoboxing",
      "Unboxing",
      "parseInt()",
      "valueOf()",
      "Primitive conversions",
      "Wrapper utility methods"
    ],
    project: "Data Conversion Utility"
  },
  {
    id: 17,
    title: "Collections Framework",
    topics: [
      "Iterable and Collection",
      "List interface",
      "ArrayList",
      "LinkedList",
      "Vector",
      "Stack",
      "Set interface",
      "HashSet",
      "LinkedHashSet",
      "TreeSet",
      "Queue",
      "PriorityQueue",
      "Deque",
      "Map interface",
      "HashMap",
      "LinkedHashMap",
      "TreeMap",
      "Iterator",
      "ListIterator",
      "Comparable",
      "Comparator",
      "Generics",
      "Collection performance"
    ],
    project: "Contact Management System"
  },
  {
    id: 18,
    title: "Advanced Core Java",
    topics: [
      "Garbage collection",
      "JVM memory areas",
      "Stack and heap",
      "Class loading",
      "Object lifecycle",
      "Inner classes",
      "Static nested classes",
      "Anonymous classes",
      "Enums",
      "Generics",
      "Lambda expressions",
      "Functional interfaces",
      "Stream API",
      "Optional",
      "File I/O",
      "Readers and writers",
      "Serialization",
      "Multithreading",
      "Thread class",
      "Runnable interface",
      "Thread lifecycle",
      "Synchronization",
      "Deadlocks",
      "JDBC",
      "Java 8+ features",
      "Date and Time API"
    ],
    project: "Student Record System"
  }
];

export const topics: JavaTopic[] = modules.flatMap(
  (module) =>
    module.topics.map((title, index) => ({
      id: `m${module.id}-t${index + 1}`,
      title,
      moduleId: module.id,
      moduleTitle: module.title,
      project: module.project
    }))
);
