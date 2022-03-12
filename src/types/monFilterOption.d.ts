import type { Ability, Move } from "@pkmn/data";
import type { Type } from "@pkmn/dex";

export interface MonFilterOption {
  filter: ?string;
  filterMove: ?Move;
  filterType1: ?Type;
  filterType2: ?Type;
  filterAbility: ?Ability;
}
