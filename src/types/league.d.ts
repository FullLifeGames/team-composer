import type { GenerationNum } from "@pkmn/dex";

export type Restriction = "Pentagon" | "Plus" | "Galar" | "Paldea";

export interface League {
  displayName: string;
  generation: GenerationNum;
  restriction?: Restriction;
  requirements: number[];
  language: "en" | "de";
  csvFunc?: () => string;
  csvLink?: string;
  doubles?: boolean;
}
