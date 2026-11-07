
import type { JavaTopic } from "./syllabus";

export interface Lesson {
  definition: string;
  why: string;
  working: string;
  syntax: string;
  program: string;
  output: string;
  dryRun: string[];
  interview: string[];
  exercise: string[];
  note: string;
}

export function makeLesson(topic: JavaTopic): Lesson {
  const title = topic.title;

  return {
    definition:
      `${title} is an important concept in ` +
      `${topic.moduleTitle}. This lesson introduces ` +
      `the concept and its use in Java programming.`,

    why:
      `Understanding ${title} helps you write ` +
      `correct and readable Java programs.`,

    working:
      `Study the rules of ${title}. Trace a small ` +
      `example manually, identify inputs and outputs, ` +
      `and test normal and boundary cases.`,

    syntax: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java Mastery");
    }
}`,

    program: `public class Main {
    public static void main(String[] args) {
        System.out.println("Learning ${title}");
    }
}`,

    output: `Learning ${title}`,

    dryRun: [
      "The JVM loads the Main class.",
      "Execution starts in the main() method.",
      "The println() statement executes.",
      "The program displays the output."
    ],

    interview: [
      `What is ${title}?`,
      `Why is ${title} important?`,
      `Where is ${title} used in Java?`,
      `Explain ${title} with an example.`,
      `What mistakes should beginners avoid?`
    ],

    exercise: [
      `Write a Java program demonstrating ${title}.`,
      "Modify the program to handle an edge case.",
      "Explain the output line by line."
    ],

    note:
      "Starter lesson only. Detailed topic-specific " +
      "explanations and verified programs are still " +
      "being developed."
  };
}
