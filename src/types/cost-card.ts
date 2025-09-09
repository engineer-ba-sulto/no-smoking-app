export interface CostCardData {
  emoji: string;
  title: string;
  amount: string;
  calculation?: string;
  highlight?: string;
  color: CostCardColor;
}

export interface ComparisonCardData {
  emoji: string;
  title: string;
  items: string[];
  color: CostCardColor;
}

export type CostCardColor = "blue" | "green" | "orange" | "red" | "purple";

export interface CostStepData {
  title: string;
  description: string;
  finalMessage: string;
  costCard: CostCardData;
  comparisonCard: ComparisonCardData;
}
