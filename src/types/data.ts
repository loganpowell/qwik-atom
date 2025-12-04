export type PokemonType =
  | "Grass"
  | "Fire"
  | "Water"
  | "Lightning"
  | "Psychic"
  | "Fighting"
  | "Darkness"
  | "Metal"
  | "Fairy"
  | "Dragon"
  | "Colorless";

export interface Attack {
  name: string;
  cost: PokemonType[];
  damage: string;
  description?: string;
}

export interface Ability {
  name: string;
  description: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  hp: number;
  type: PokemonType;
  stage?: string; // "Basic", "Stage 1", "Stage 2", etc.
  evolvesFrom?: string;
  attacks: Attack[];
  ability?: Ability;
  weakness?: { type: PokemonType; multiplier: string };
  resistance?: { type: PokemonType; amount: string };
  retreatCost: number;
  rarity?: string; // "Common", "Uncommon", "Rare", etc.
  illustrator?: string;
  cardNumber?: string;
  set?: string;
}

export interface DataState {
  count: number;
  features: Feature[];
}

export interface AppState {
  // Baseline from JSON file (read-only reference)
  committed: DataState;

  // Working copy (user modifications)
  staged: DataState;

  // Computed diff (committed vs staged)
  diff: {
    hasChanges: boolean;
    changedPaths: string[];
    summary: {
      addedCount: number;
      modifiedCount: number;
      deletedCount: number;
    };
  };
}
