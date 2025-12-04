import type { Signal } from "@qwik.dev/core";
import type { Feature, PokemonType } from "~/types/data";

export interface PokemonCardProps {
  feature: Feature;
  onUpdate: (updates: Partial<Feature>) => void;
  onDelete: () => void;
  isHighlighted: Signal<boolean>;
  showCopied: Signal<boolean>;
  onCopyLink: () => void;
  onToggleEdit: () => void;
}

export interface CardStyleConfig {
  spacing: {
    unit: string;
    small: string;
    medium: string;
    large: string;
  };
  typography: {
    primary: string;
    secondary: string;
    label: string;
    tiny: string;
  };
}

export const defaultCardStyle: CardStyleConfig = {
  spacing: {
    unit: "calc(var(--spacing-unit) * 1)",
    small: "calc(var(--spacing-unit) * 0.5)",
    medium: "calc(var(--spacing-unit) * 2)",
    large: "calc(var(--spacing-unit) * 3)",
  },
  typography: {
    primary: "1.25rem",
    secondary: "0.875rem",
    label: "0.75rem",
    tiny: "0.65rem",
  },
};

export const POKEMON_TYPES: PokemonType[] = [
  "Grass",
  "Fire",
  "Water",
  "Lightning",
  "Psychic",
  "Fighting",
  "Darkness",
  "Metal",
  "Fairy",
  "Dragon",
  "Colorless",
];

export const createBarViz = (value: number, max: number = 120) => {
  const bars = Math.ceil((value / max) * 20);
  return "|".repeat(bars);
};
