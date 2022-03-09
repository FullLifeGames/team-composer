import { GenerationNum } from "@pkmn/dex";

export interface League {
  displayName: string;
  csv: string;
  generation: GenerationNum;
  requirements: number[];
  doubles?: boolean;
}
