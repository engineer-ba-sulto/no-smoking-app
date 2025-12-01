import React from "react";
import { ComparisonCard, CostCard, CostStepWrapper } from "./ui";

interface AnnualCostNewStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const annualCostData = {
  costCard: {
    emoji: "📅",
    title: "年間コスト計算",
    amount: "219,000円",
    calculation: "600円 × 365日 = 219,000円",
    highlight: "💰 月額換算: 18,250円",
    color: "green" as const,
  },
  comparisonCard: {
    emoji: "📊",
    title: "219,000円でできること",
    items: ["高級ホテル宿泊 3-4泊分", "高級レストラン 20-30回分"],
    color: "blue" as const,
  },
};

export const AnnualCostNewStep = ({
  onNext,
  animatedStyle,
}: AnnualCostNewStepProps) => (
  <CostStepWrapper
    title="年間コスト"
    description="年間のコストを考えてみましょう"
    finalMessage="年間のコストを考えてみましょう 📅"
    onNext={onNext}
    animatedStyle={animatedStyle}
  >
    <CostCard data={annualCostData.costCard} />
    <ComparisonCard data={annualCostData.comparisonCard} />
  </CostStepWrapper>
);
