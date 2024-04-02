import { whoopsieLevels } from "@/util/whoopsieLevels";
import SemiCircleIndicator from "../components/SemiCircleIndicator";

const getWhoopsieLevelValue = (levelName: string) => {
  // Find the index of the level by name, then add 1 to get a 1-based scale
  const index = whoopsieLevels.findIndex((level) => level.name === levelName);
  return index >= 0 ? index + 1 : 0; // Returns 0 if the level name is not found
};

export const WhoopsieIndicator = ({ whoopsieName }: any) => {
  const levelValue = getWhoopsieLevelValue(whoopsieName);

  return <SemiCircleIndicator value={levelValue} />;
};
