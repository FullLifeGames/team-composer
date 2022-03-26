import type { GenerationNum } from "@pkmn/dex";

export interface League {
  displayName: string;
  generation: GenerationNum;
  requirements: number[];
  language: "en" | "de";
  csvFunc?: () => string;
  csvLink?: string;
  doubles?: boolean;
}
