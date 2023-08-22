import type { generateTeam as mainFunction } from "@/util/algorithm";

export let generateTeamFunc: undefined | typeof mainFunction = undefined;

export const getGenerateTeam = async () => {
  if (generateTeamFunc === undefined) {
    const algorithm = await import("@/util/algorithm");
    generateTeamFunc = algorithm.generateTeam;
  }
  return generateTeamFunc;
};
