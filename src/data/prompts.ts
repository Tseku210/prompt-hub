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
];
