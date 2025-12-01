import React from "react";
import { ComparisonCard, CostCard, CostStepWrapper } from "./ui";

interface DailyCostStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const dailyCostData = {
  costCard: {
    emoji: "💰",
    title: "コスト計算",
    amount: "600円",
    color: "blue" as const,
  },
  comparisonCard: {
    emoji: "⏰",
    title: "600円でできること",
    items: ["ランチ代 2-3回分", "コーヒー 10-15杯分"],
    color: "orange" as const,
  },
};

export const DailyCostStep = ({
  onNext,
  animatedStyle,
}: DailyCostStepProps) => (
  <CostStepWrapper
    title="1日のコスト"
    description="1日あたりのコストを計算してみましょう"
    finalMessage="1日あたりのコストを意識しましょう ⏰"
    onNext={onNext}
    animatedStyle={animatedStyle}
  >
    <CostCard data={dailyCostData.costCard} />
    <ComparisonCard data={dailyCostData.comparisonCard} />
  </CostStepWrapper>
);
