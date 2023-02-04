import type { Ability, Move } from "@pkmn/data";
import type { Type } from "@pkmn/dex";

export interface MonFilterOption {
  filter: ?string;
  filterMove: Move | -1;
  filterType1: Type | -1;
  filterType2: Type | -1;
  filterAbility: Ability | -1;
}
