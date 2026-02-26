import type { Prompt } from "@/types/prompt";

export const prompts: Prompt[] = [
  {
    id: "flashcard-generator",
    title: "Flashcard Generator",
    description:
      "Convert any material into spaced-repetition flashcards for RemNote syntax.",
    category: "Learning",
    variables: [
      {
        name: "topic",
        label: "Topic / Subject",
        placeholder: "e.g. React hooks",
      },
      {
        name: "material",
        label: "Source Material",
        placeholder: "Paste the text you want to convert...",
      },
    ],
    prompt: `Generate flashcards about {{topic}}.

<material>
{{material}}
<material>

Use these card formats:

1. Basic card (question → answer, one direction):
Question >> Answer

2. Concept card (bidirectional, best for definitions and terms):
Term :: Definition

3. Cloze (fill-in-the-blank, best for facts and formulas):
The mitochondria is {{the powerhouse of the cell}}.

Rules:
- Choose the format that best fits the card's content — don't use the same format for everything
- Use Concept (::) for terms and definitions
- Use Basic (>>) for cause/effect, process steps, or directional knowledge
- Use Cloze for facts, dates, formulas, or completing a key phrase
- Keep questions specific and atomic — one idea per card
- Keep answers concise but complete
- Output only the cards with no explanation, headers, or extra text`,
  },
  {
    id: "socratic-convo",
    title: "Socratic convo",
    description:
      "Engage in Socratic style conversation over a user-given topic.",
    category: "Learning",
    variables: [
      {
        name: "conversation",
        label: "conversation",
      },
    ],
    prompt: `
You are an AI assistant capable of having in-depth Socratic style conversations on a wide range of topics. Your goal is to ask probing questions to help the user critically examine their beliefs and perspectives on the topic. Do not just give your own views, but engage in back-and-forth questioning to stimulate deeper thought and reflection.

{{conversation}}
`,
  },
  {
    id: "content-angles",
    title: "5 content angles",
    description:
      "Get 5 challenging angles in your industry for your next content",
    category: "Content",
    variables: [
      {
        name: "industry",
        label: "industry",
      },
    ],
    prompt: `
Give me 5 content angles that challenge a common belief in my industry {{industry}}
`,
  },
  {
    id: "content-repurpose",
    title: "Multi-Format Transformation",
    description:
      "Transform a single idea into a video script, LinkedIn post, and carousel",
    category: "Content",
    variables: [
      {
        name: "idea",
        label: "Core Idea/Topic",
      },
    ],
    prompt: `Transform this idea into 3 formats: a feature video, a LinkedIn post, and an educational carousel: 

{{idea}}`,
  },
  {
    id: "perspectives-rewrite",
    title: "Triple Perspective Rewrite",
    description:
      "View a topic through the eyes of a novice, an expert, and a skeptic",
    category: "Content",
    variables: [
      {
        name: "topic",
        label: "Topic",
      },
    ],
    prompt: `Rewrite this topic through the eyes of a novice, an expert, and a skeptic:

{{topic}}`,
  },
  {
    id: "hidden-insights",
    title: "Unexpected Insights",
    description:
      "Uncover underappreciated or hidden angles within a specific topic",
    category: "Content",
    variables: [
      {
        name: "topic",
        label: "Topic",
      },
    ],
    prompt: `What is the most unexpected or underappreciated insight hidden in this topic? 

{{topic}}`,
  },
];
