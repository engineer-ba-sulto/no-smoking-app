import React from "react";
import { ComparisonCard, CostCard, CostStepWrapper } from "./ui";

interface TenYearCostStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const tenYearCostData = {
  costCard: {
    emoji: "🚗",
    title: "10年間の総額",
    amount: "2,190,000円",
    calculation: "219,000円 × 10年 = 2,190,000円",
    highlight: "🚗 新車1台分の価格！",
    color: "orange" as const,
  },
  comparisonCard: {
    emoji: "💡",
    title: "10年でできること",
    items: ["新車購入（頭金含む）", "住宅ローンの頭金"],
    color: "red" as const,
  },
};

export const TenYearCostStep = ({
  onNext,
  animatedStyle,
}: TenYearCostStepProps) => (
  <CostStepWrapper
    title="10年コスト"
    description="10年間の経済損失を考えてみましょう"
    finalMessage="10年間の経済損失を考えてみましょう 🚗"
    onNext={onNext}
    animatedStyle={animatedStyle}
  >
    <CostCard data={tenYearCostData.costCard} />
    <ComparisonCard data={tenYearCostData.comparisonCard} />
  </CostStepWrapper>
);
