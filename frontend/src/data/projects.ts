export interface ProjectGuide {
  id: string;
  title: string;
  moduleTitle: string;
  summary: string;
  steps: string[];
  code: string;
}

export const projectGuides: ProjectGuide[] = [
  {
    id: "student-profile",
    title: "Student Profile Generator",
    moduleTitle: "Introduction to Java",
    summary: "Collect a student's details and print a clean profile card.",
    steps: ["Create a Main class with the standard main method.", "Read a name, age, and course from the console.", "Print the values with labels; then try running the program with different inputs."],
    code: `import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Name: ");\n    String name = input.nextLine();\n    System.out.print("Age: ");\n    int age = input.nextInt();\n    System.out.println("Student: " + name + " (" + age + ")");\n  }\n}`
  },
  {
    id: "marks-calculator",
    title: "Student Marks Calculator",
    moduleTitle: "Variables and Data Types",
    summary: "Store marks, calculate a total and average, and display the result.",
    steps: ["Choose a numeric type for marks and totals.", "Read marks for each subject and add them.", "Calculate the average and check that each mark is within the valid range."],
    code: `public class Main {\n  public static void main(String[] args) {\n    int math = 82, science = 91, english = 76;\n    int total = math + science + english;\n    double average = total / 3.0;\n    System.out.println("Total: " + total);\n    System.out.println("Average: " + average);\n  }\n}`
  },
  {
    id: "smart-calculator",
    title: "Smart Calculator",
    moduleTitle: "Operators",
    summary: "Perform a selected arithmetic operation on two numbers.",
    steps: ["Read two numbers and an operation symbol.", "Use a switch to select the calculation.", "Handle division by zero and reject unknown operations."],
    code: `public class Main {\n  static double calculate(double a, double b, char op) {\n    return switch (op) {\n      case '+' -> a + b; case '-' -> a - b;\n      case '*' -> a * b;\n      case '/' -> b == 0 ? Double.NaN : a / b;\n      default -> throw new IllegalArgumentException("Unknown operation");\n    };\n  }\n  public static void main(String[] args) {\n    System.out.println(calculate(12, 4, '*'));\n  }\n}`
  },
  {
    id: "expense-calculator",
    title: "Personal Expense Calculator",
    moduleTitle: "Input and Output",
    summary: "Read a list of expenses and report the total and average.",
    steps: ["Ask how many expenses will be entered.", "Read each amount and add it to a running total.", "Print the total and average with two decimal places."],
    code: `import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    System.out.print("How many expenses? ");\n    int count = in.nextInt();\n    double total = 0;\n    for (int i = 1; i <= count; i++) total += in.nextDouble();\n    System.out.printf("Total: %.2f; average: %.2f%n", total, count == 0 ? 0 : total / count);\n  }\n}`
  },
  {
    id: "electricity-bill",
    title: "Electricity Bill Management System",
    moduleTitle: "Conditional Statements",
    summary: "Estimate a bill using simple unit-rate tiers.",
    steps: ["Read the number of units used.", "Apply the chosen rate for each tier with if/else conditions.", "Show the units and estimated amount; test values on both sides of each tier boundary."],
    code: `public class Main {\n  static double bill(int units) {\n    if (units <= 100) return units * 1.5;\n    if (units <= 300) return 150 + (units - 100) * 2.5;\n    return 650 + (units - 300) * 4.0;\n  }\n  public static void main(String[] args) {\n    int units = 250;\n    System.out.printf("Estimated bill: %.2f%n", bill(units));\n  }\n}`
  },
  {
    id: "number-toolkit",
    title: "Number Analysis Toolkit",
    moduleTitle: "Loops and Number Programs",
    summary: "Check a number and report useful properties such as whether it is prime.",
    steps: ["Read a positive integer and validate it.", "Use a loop to test divisors only up to the square root.", "Add more menu options for digit sum, palindrome, and factorial."],
    code: `public class Main {\n  static boolean isPrime(int n) {\n    if (n < 2) return false;\n    for (int d = 2; d <= n / d; d++) if (n % d == 0) return false;\n    return true;\n  }\n  public static void main(String[] args) {\n    int value = 29;\n    System.out.println(value + (isPrime(value) ? " is prime" : " is not prime"));\n  }\n}`
  },
  {
    id: "pattern-generator",
    title: "Pattern Generator",
    moduleTitle: "Pattern Programming",
    summary: "Print a triangle or other shape using nested loops.",
    steps: ["Ask for the height of the pattern.", "Use an outer loop for rows and an inner loop for symbols.", "Add a menu for a pyramid, diamond, and hollow square."],
    code: `public class Main {\n  public static void main(String[] args) {\n    int height = 5;\n    for (int row = 1; row <= height; row++) {\n      for (int star = 1; star <= row; star++) System.out.print("*");\n      System.out.println();\n    }\n  }\n}`
  },
  {
    id: "array-visualizer",
    title: "ArrayVerse Visualizer",
    moduleTitle: "Arrays",
    summary: "Summarize an array and show how a search visits each element.",
    steps: ["Read values into an int array.", "Traverse once to find the minimum, maximum, and sum.", "Add a search that prints each checked index and whether it matched."],
    code: `public class Main {\n  public static void main(String[] args) {\n    int[] values = { 8, 3, 12, 5 };\n    int min = values[0], max = values[0], sum = 0;\n    for (int value : values) {\n      min = Math.min(min, value); max = Math.max(max, value); sum += value;\n    }\n    System.out.printf("min=%d max=%d average=%.1f%n", min, max, sum / (double) values.length);\n  }\n}`
  },
  {
    id: "text-analyzer",
    title: "Text Analyzer",
    moduleTitle: "Strings",
    summary: "Count words and vowels in a sentence using String methods.",
    steps: ["Read the full sentence with nextLine().", "Normalize the text and split it into words.", "Loop over the characters to count vowels; try empty and mixed-case input."],
    code: `public class Main {\n  public static void main(String[] args) {\n    String text = "Java makes useful tools";\n    int vowels = 0;\n    for (char ch : text.toLowerCase().toCharArray())\n      if ("aeiou".indexOf(ch) >= 0) vowels++;\n    int words = text.isBlank() ? 0 : text.trim().split("\\\\s+").length;\n    System.out.println("Words: " + words + ", vowels: " + vowels);\n  }\n}`
  },
  {
    id: "banking-calculator",
    title: "Modular Banking Calculator",
    moduleTitle: "Methods",
    summary: "Separate deposit, withdrawal, and balance calculations into methods.",
    steps: ["Represent the balance with a decimal type such as BigDecimal for real currency work.", "Write separate methods for deposit and withdrawal validation.", "Test that negative deposits and withdrawals above the balance are rejected."],
    code: `public class Main {\n  static double deposit(double balance, double amount) {\n    if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");\n    return balance + amount;\n  }\n  public static void main(String[] args) {\n    double balance = deposit(100.00, 25.00);\n    System.out.printf("Simulated balance: %.2f%n", balance);\n  }\n}`
  },
  {
    id: "student-management",
    title: "Student Management System",
    moduleTitle: "Classes and Objects",
    summary: "Create Student objects with fields, a constructor, and a display method.",
    steps: ["Create a Student class with private name and id fields.", "Initialize fields in a constructor and add getters.", "Create a few objects and display their details."],
    code: `class Student {\n  private final String name;\n  private final int id;\n  Student(String name, int id) { this.name = name; this.id = id; }\n  void display() { System.out.println(id + ": " + name); }\n}\npublic class Main {\n  public static void main(String[] args) { new Student("Asha", 101).display(); }\n}`
  },
  {
    id: "employee-management",
    title: "Employee Management System",
    moduleTitle: "Object-Oriented Programming",
    summary: "Model employees with shared fields and specialized salary calculations.",
    steps: ["Define an Employee base class with shared identity fields.", "Create subclasses for full-time and hourly employees.", "Override a pay calculation method and use a list of Employee objects."],
    code: `abstract class Employee {\n  private final String name;\n  Employee(String name) { this.name = name; }\n  String name() { return name; }\n  abstract double monthlyPay();\n}\nclass SalariedEmployee extends Employee {\n  SalariedEmployee(String name) { super(name); }\n  double monthlyPay() { return 4000.0; }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Employee e = new SalariedEmployee("Ravi");\n    System.out.println(e.name() + " earns " + e.monthlyPay());\n  }\n}`
  },
  {
    id: "secure-profile",
    title: "Secure User Profile",
    moduleTitle: "Access Modifiers and Keywords",
    summary: "Protect profile fields and update them only through validated methods.",
    steps: ["Make fields private and expose only the operations users need.", "Validate new values inside setters or update methods.", "Use final for values that should never change and test invalid updates."],
    code: `class Profile {\n  private String displayName;\n  Profile(String displayName) { updateName(displayName); }\n  void updateName(String value) {\n    if (value == null || value.isBlank()) throw new IllegalArgumentException("Name required");\n    displayName = value.trim();\n  }\n  String displayName() { return displayName; }\n}\npublic class Main {\n  public static void main(String[] args) { System.out.println(new Profile("Mina").displayName()); }\n}`
  },
  {
    id: "college-management",
    title: "College Management System",
    moduleTitle: "Packages",
    summary: "Organize student, course, and service classes into clear packages.",
    steps: ["Create packages such as college.student and college.course.", "Put each public class in a matching source file and folder.", "Import the types that Main uses and compile from the project root."],
    code: `// File: college/student/Student.java\npackage college.student;\npublic class Student {\n  private final String name;\n  public Student(String name) { this.name = name; }\n  public String name() { return name; }\n}\n// In another file: import college.student.Student;`
  },
  {
    id: "atm-validation",
    title: "ATM Validation System",
    moduleTitle: "Exception Handling",
    summary: "Validate a simulated withdrawal and report clear error messages.",
    steps: ["Create a withdrawal method that checks amount and available balance.", "Throw an exception for invalid requests and catch it at the user interface.", "Test zero, negative, valid, and too-large withdrawal amounts."],
    code: `public class Main {\n  static double withdraw(double balance, double amount) {\n    if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");\n    if (amount > balance) throw new IllegalStateException("Insufficient funds");\n    return balance - amount;\n  }\n  public static void main(String[] args) {\n    try { System.out.println(withdraw(100, 30)); }\n    catch (RuntimeException ex) { System.out.println(ex.getMessage()); }\n  }\n}`
  },
  {
    id: "data-conversion",
    title: "Data Conversion Utility",
    moduleTitle: "Wrapper Classes",
    summary: "Convert text input safely into numbers and report invalid values.",
    steps: ["Read a numeric value as text.", "Use wrapper parsing methods such as Integer.parseInt.", "Catch NumberFormatException and show the expected format."],
    code: `public class Main {\n  public static void main(String[] args) {\n    String input = "2048";\n    try {\n      int value = Integer.parseInt(input);\n      System.out.println("Parsed value: " + value);\n    } catch (NumberFormatException ex) {\n      System.out.println("Enter a whole number.");\n    }\n  }\n}`
  },
  {
    id: "contact-management",
    title: "Contact Management System",
    moduleTitle: "Collections Framework",
    summary: "Store contacts by name and support adding and searching entries.",
    steps: ["Use a Map from contact name to phone number.", "Add menu actions to insert, find, update, and list contacts.", "Decide how duplicate names should be handled and test each action."],
    code: `import java.util.LinkedHashMap;\nimport java.util.Map;\n\npublic class Main {\n  public static void main(String[] args) {\n    Map<String, String> contacts = new LinkedHashMap<>();\n    contacts.put("Asha", "555-0101");\n    contacts.put("Ravi", "555-0102");\n    System.out.println(contacts.getOrDefault("Asha", "Not found"));\n  }\n}`
  },
  {
    id: "student-records",
    title: "Student Record System",
    moduleTitle: "Advanced Core Java",
    summary: "Keep a collection of student records and save a simple report to a file.",
    steps: ["Create a Student record or class for each learner.", "Store records in an ArrayList and add search or sort actions.", "Write a report with Files.writeString and handle file errors."],
    code: `import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n  record Student(int id, String name) {}\n  public static void main(String[] args) {\n    List<Student> students = new ArrayList<>();\n    students.add(new Student(1, "Leena"));\n    students.add(new Student(2, "Omar"));\n    students.forEach(s -> System.out.println(s.id() + " " + s.name()));\n  }\n}`
  },
  {
    id: "smartbank-major",
    title: "SmartBank — Banking Management System",
    moduleTitle: "Major Project",
    summary: "Build a practice banking app with accounts, simulated transactions, and a transaction history.",
    steps: ["Model Customer, Account, and Transaction; keep money in BigDecimal.", "Implement registration, deposit, withdrawal, transfer, and history as service methods.", "Add validation and unit checks, then persist records with JDBC before adding a Spring Boot API.", "Use simulated data only; never connect this learning project to real accounts or payments."],
    code: `import java.math.BigDecimal;\n\nclass Account {\n  private BigDecimal balance = BigDecimal.ZERO;\n  void deposit(BigDecimal amount) {\n    if (amount.signum() <= 0) throw new IllegalArgumentException("Positive amount required");\n    balance = balance.add(amount);\n  }\n  BigDecimal balance() { return balance; }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Account demo = new Account(); demo.deposit(new BigDecimal("25.00"));\n    System.out.println("Simulated balance: " + demo.balance());\n  }\n}`
  },
  {
    id: "moviemate-major",
    title: "MovieMate — Movie Ticket Booking System",
    moduleTitle: "Major Project",
    summary: "Build a booking app with shows, seat selection, booking history, and simulated payments.",
    steps: ["Model Movie, Show, Seat, and Booking as separate types.", "Track seat availability per show and prevent duplicate bookings.", "Add search, booking, cancellation, and history; persist with a database in a later stage.", "Test two users trying to reserve the same seat and keep payments simulated."],
    code: `import java.util.HashSet;\nimport java.util.Set;\n\nclass Show {\n  private final Set<String> booked = new HashSet<>();\n  boolean book(String seat) { return booked.add(seat); }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Show evening = new Show();\n    System.out.println(evening.book("A1")); // first booking succeeds\n    System.out.println(evening.book("A1")); // duplicate is rejected\n  }\n}`
  }
];
