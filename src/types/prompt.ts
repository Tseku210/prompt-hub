export interface Variable {
  name: string;
  label: string;
  placeholder?: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  variables: Variable[];
  prompt: string;
}
