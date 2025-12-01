import React from "react";
import { ComparisonCard, CostCard, CostStepWrapper } from "./ui";

interface TwentyYearCostStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const twentyYearCostData = {
  costCard: {
    emoji: "🏠",
    title: "20年間の総額",
    amount: "4,380,000円",
    calculation: "219,000円 × 20年 = 4,380,000円",
    highlight: "🏠 住宅の頭金分！",
    color: "red" as const,
  },
  comparisonCard: {
    emoji: "💰",
    title: "20年でできること",
    items: ["住宅ローンの頭金", "子供2人の教育費（大学まで）"],
    color: "purple" as const,
  },
};

export const TwentyYearCostStep = ({
  onNext,
  animatedStyle,
}: TwentyYearCostStepProps) => (
  <CostStepWrapper
    title="20年コスト"
    description="20年間の経済損失を考えてみましょう"
    finalMessage="20年間の経済損失を考えてみましょう 🏠"
    onNext={onNext}
    animatedStyle={animatedStyle}
  >
    <CostCard data={twentyYearCostData.costCard} />
    <ComparisonCard data={twentyYearCostData.comparisonCard} />
  </CostStepWrapper>
);
