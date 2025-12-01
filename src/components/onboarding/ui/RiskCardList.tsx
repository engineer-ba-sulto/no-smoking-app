import React from "react";
import { View } from "react-native";
import { RiskCardColor, RiskCardData } from "../../../types/risk-card";
import { RiskCard } from "./RiskCard";

interface RiskCardListProps {
  cards: RiskCardData[];
  color: RiskCardColor;
}

export const RiskCardList: React.FC<RiskCardListProps> = ({ cards, color }) => {
  return (
    <View className="w-full mb-4">
      {cards.map((card, index) => (
        <RiskCard
          key={index}
          emoji={card.emoji}
          title={card.title}
          description={card.description}
          color={color}
        />
      ))}
    </View>
  );
};
