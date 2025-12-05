import { component$, type QRL, type Signal } from "@qwik.dev/core";
import type { Feature, PokemonType, Attack } from "~/types/data";
import { POKEMON_TYPES } from "./types";
import {
  AutoSizeInput,
  BarSlider,
  LabeledInput,
  InputGrid,
} from "./FormElements";

interface UnifiedCardProps {
  feature: Feature;
  onUpdate: QRL<(updates: Partial<Feature>) => void>;
  onDelete: QRL<() => void>;
  isEditing: Signal<boolean>;
  isHighlighted: Signal<boolean>;
  showCopied: Signal<boolean>;
  onCopyLink: QRL<() => void>;
}

export const UnifiedPokemonCard = component$<UnifiedCardProps>(
  ({ feature, onUpdate, onDelete, isEditing, showCopied, onCopyLink }) => {
    const updateFeature = onUpdate;
    const editing = isEditing.value;

    return (
      <>
        <style>
          {`
            .unified-pokemon-card input,
            .unified-pokemon-card select,
            .unified-pokemon-card textarea {
              border: none;
              background: transparent;
              padding: 0;
              margin: 0;
              outline: none;
            }

            .unified-pokemon-card select:disabled {
              appearance: none;
              cursor: default;
            }

            .unified-pokemon-card textarea:disabled {
              cursor: default;
              resize: none;
            }

            .card-permalink {
              opacity: 0;
              transition: opacity 0.2s ease;
              padding: calc(var(--spacing-unit) * 1.2);
            }

            .unified-pokemon-card:hover .card-permalink {
              opacity: 1;
            }
          `}
        </style>

        <div class="unified-pokemon-card">
          {/* Card Number & HP Anchor (Top Left) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "calc(var(--spacing-unit) * 2)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "calc(var(--spacing-unit) * 0.5)",
                position: "relative",
              }}
            >
              {/* Permalink hash - appears on hover to the left */}
              {!editing && (
                <a
                  href={`#${feature.id}`}
                  class="card-permalink"
                  style={{
                    position: "absolute",
                    left: "-3rem",
                    bottom: "calc(var(--spacing-unit) * 0.5 + 19.5px)",
                    fontSize: "2rem",
                    fontWeight: "900",
                    fontFamily: "monospace",
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                    lineHeight: "1",
                  }}
                  title="Permalink to this card"
                >
                  #
                </a>
              )}

              {/* Card Number as link in view mode, input in edit mode */}
              {editing ? (
                <input
                  type="text"
                  value={feature.cardNumber || ""}
                  onInput$={(e) =>
                    updateFeature({
                      cardNumber: (e.target as HTMLInputElement).value,
                    })
                  }
                  placeholder="###"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "900",
                    fontFamily: "monospace",
                    color: "var(--color-text-primary)",
                    width: "80px",
                  }}
                />
              ) : (
                <a
                  href={`#${feature.id}`}
                  style={{
                    fontSize: "2rem",
                    fontWeight: "900",
                    fontFamily: "monospace",
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    width: "80px",
                  }}
                  title="Permalink to this card"
                >
                  {feature.cardNumber || "###"}
                </a>
              )}
              <LabeledInput
                label="HP"
                value={feature.hp || ""}
                onInput$={(value) => {
                  const parsed = parseInt(value);
                  if (!isNaN(parsed) || value === "") {
                    updateFeature({ hp: value === "" ? 0 : parsed });
                  }
                }}
                disabled={!editing}
                type="number"
                width="50px"
              />
            </div>

            <div
              style={{ display: "flex", gap: "calc(var(--spacing-unit) * 1)" }}
            >
              {editing ? (
                <>
                  <button
                    class="primary"
                    onClick$={() => (isEditing.value = false)}
                    style={{
                      padding:
                        "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Done
                  </button>
                  <button
                    class="accent"
                    onClick$={onDelete}
                    style={{
                      padding:
                        "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick$={() => (isEditing.value = true)}
                    style={{
                      padding:
                        "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    class="accent"
                    onClick$={onDelete}
                    style={{
                      padding:
                        "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name */}
          <AutoSizeInput
            value={feature.name}
            onInput$={(value) => updateFeature({ name: value })}
            disabled={!editing}
            placeholder="Pokémon Name"
            maxLength={25}
          />

          {/* Metadata - Stage, Type, Evolves From */}
          <InputGrid columns="minmax(80px, auto) minmax(100px, 1fr)">
            <input
              type="text"
              value={feature.stage || ""}
              onInput$={(e) =>
                updateFeature({ stage: (e.target as HTMLInputElement).value })
              }
              placeholder="Stage"
              disabled={!editing}
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
                fontFamily: "monospace",
              }}
            />

            <select
              value={feature.type}
              onChange$={(e) =>
                updateFeature({
                  type: (e.target as HTMLSelectElement).value as PokemonType,
                })
              }
              disabled={!editing}
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
                fontFamily: "monospace",
              }}
            >
              {POKEMON_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {(editing || feature.evolvesFrom) && (
              <input
                type="text"
                value={feature.evolvesFrom || ""}
                onInput$={(e) =>
                  updateFeature({
                    evolvesFrom: (e.target as HTMLInputElement).value,
                  })
                }
                placeholder="Evolves from"
                disabled={!editing}
                style={{
                  gridColumn: "1 / -1",
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary)",
                  fontFamily: "monospace",
                }}
              />
            )}
          </InputGrid>

          {/* HP Visualization - Dynamic bar based on HP value */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              height: "20px",
              alignItems: "flex-end",
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => {
              const threshold = (i + 1) * 10; // Each bar represents 10 HP
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background:
                      feature.hp >= threshold
                        ? "var(--color-text-primary)"
                        : "var(--color-border)",
                    opacity: feature.hp >= threshold ? 1 : 0.3,
                    transition: "background 0.2s ease, opacity 0.2s ease",
                  }}
                />
              );
            })}
          </div>

          {/* Ability */}
          {(editing || feature.ability) && (
            <div
              style={{
                paddingLeft: "calc(var(--spacing-unit) * 2)",
                borderLeft: "1px solid var(--color-border)",
              }}
            >
              <input
                type="text"
                value={feature.ability?.name || ""}
                onInput$={(e) => {
                  const name = (e.target as HTMLInputElement).value;
                  if (name || feature.ability) {
                    updateFeature({
                      ability: {
                        name,
                        description: feature.ability?.description || "",
                      },
                    });
                  }
                }}
                placeholder="Ability name (optional)"
                disabled={!editing}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  marginBottom: feature.ability?.name
                    ? "calc(var(--spacing-unit) * 1)"
                    : "0",
                  width: "100%",
                }}
              />
              {(editing || feature.ability?.description) && (
                <textarea
                  value={feature.ability?.description || ""}
                  onInput$={(e) => {
                    updateFeature({
                      ability: {
                        name: feature.ability?.name || "",
                        description: (e.target as HTMLTextAreaElement).value,
                      },
                    });
                  }}
                  placeholder="Ability description"
                  disabled={!editing}
                  rows={2}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: "1.4",
                    width: "100%",
                    fontFamily: "inherit",
                  }}
                />
              )}
            </div>
          )}

          {/* Attacks */}
          <div
            style={{ display: "grid", gap: "calc(var(--spacing-unit) * 3)" }}
          >
            {feature.attacks.map((attack: Attack, idx: number) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gap: "calc(var(--spacing-unit) * 0.75)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "calc(var(--spacing-unit) * 1)",
                  }}
                >
                  <input
                    type="text"
                    value={attack.name}
                    onInput$={(e) => {
                      const newAttacks = [...feature.attacks];
                      newAttacks[idx] = {
                        ...attack,
                        name: (e.target as HTMLInputElement).value,
                      };
                      updateFeature({ attacks: newAttacks });
                    }}
                    disabled={!editing}
                    placeholder="Attack name"
                    style={{
                      flex: 1,
                      fontWeight: "700",
                      fontSize: "0.875rem",
                      width: "100%",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <input
                      type="text"
                      value={attack.damage}
                      onInput$={(e) => {
                        const newAttacks = [...feature.attacks];
                        newAttacks[idx] = {
                          ...attack,
                          damage: (e.target as HTMLInputElement).value,
                        };
                        updateFeature({ attacks: newAttacks });
                      }}
                      disabled={!editing}
                      placeholder="10"
                      style={{
                        width: "50px",
                        textAlign: "right",
                        fontWeight: "700",
                      }}
                    />
                    {editing && (
                      <button
                        onClick$={() => {
                          const newAttacks = feature.attacks.filter(
                            (_: Attack, i: number) => i !== idx
                          );
                          updateFeature({ attacks: newAttacks });
                        }}
                        style={{
                          padding: "1px 4px",
                          fontSize: "0.75rem",
                          background: "var(--color-accent)",
                          color: "white",
                          border: "none",
                          borderRadius: "2px",
                          cursor: "pointer",
                          lineHeight: "1",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={attack.cost.join(", ")}
                  onInput$={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    const cost = value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t) as any[];
                    const newAttacks = [...feature.attacks];
                    newAttacks[idx] = { ...attack, cost };
                    updateFeature({ attacks: newAttacks });
                  }}
                  placeholder="Energy cost"
                  disabled={!editing}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-secondary)",
                    width: "100%",
                  }}
                />

                {(editing || attack.description) && (
                  <textarea
                    value={attack.description || ""}
                    onInput$={(e) => {
                      const newAttacks = [...feature.attacks];
                      newAttacks[idx] = {
                        ...attack,
                        description: (e.target as HTMLTextAreaElement).value,
                      };
                      updateFeature({ attacks: newAttacks });
                    }}
                    placeholder="Attack description"
                    disabled={!editing}
                    rows={2}
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: "1.4",
                      width: "100%",
                      fontFamily: "inherit",
                      marginBottom: "calc(var(--spacing-unit) * 1)",
                    }}
                  />
                )}
              </div>
            ))}

            {editing && (
              <button
                onClick$={() => {
                  const newAttack = {
                    name: "New Attack",
                    cost: ["Colorless" as PokemonType],
                    damage: "10",
                  };
                  updateFeature({ attacks: [...feature.attacks, newAttack] });
                }}
                style={{
                  padding:
                    "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
                  fontSize: "0.75rem",
                  marginBottom: "calc(var(--spacing-unit) * 1)",
                  marginTop: "calc(var(--spacing-unit) * -1)",
                }}
              >
                + Add Attack
              </button>
            )}
          </div>

          {/* Description */}
          <textarea
            value={feature.description}
            onInput$={(e) =>
              updateFeature({
                description: (e.target as HTMLTextAreaElement).value,
              })
            }
            placeholder="Pokémon description"
            disabled={!editing}
            rows={3}
            style={{
              fontStyle: "italic",
              fontSize: "0.875rem",
              lineHeight: "1.4",
              width: "100%",
              fontFamily: "inherit",
              color: "inherit",
            }}
          />

          {/* Stats Footer */}
          <InputGrid columns="auto auto 1fr">
            {/* Weakness */}
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {editing && (
                <input
                  type="checkbox"
                  checked={!!feature.weakness}
                  onChange$={(e) => {
                    if ((e.target as HTMLInputElement).checked) {
                      updateFeature({
                        weakness: { type: "Fire", multiplier: "×2" },
                      });
                    } else {
                      updateFeature({ weakness: undefined });
                    }
                  }}
                />
              )}
              <label
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                {!editing && feature.weakness
                  ? `weak: ${feature.weakness.type} ${feature.weakness.multiplier}`
                  : "weakness"}
              </label>
              {editing && feature.weakness && (
                <>
                  <select
                    value={feature.weakness.type}
                    onChange$={(e) => {
                      updateFeature({
                        weakness: {
                          ...feature.weakness!,
                          type: (e.target as HTMLSelectElement)
                            .value as PokemonType,
                        },
                      });
                    }}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {POKEMON_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={feature.weakness.multiplier}
                    onInput$={(e) => {
                      updateFeature({
                        weakness: {
                          ...feature.weakness!,
                          multiplier: (e.target as HTMLInputElement).value,
                        },
                      });
                    }}
                    style={{ width: "50px", fontSize: "0.75rem" }}
                    placeholder="×2"
                  />
                </>
              )}
            </div>

            {/* Resistance */}
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {editing && (
                <input
                  type="checkbox"
                  checked={!!feature.resistance}
                  onChange$={(e) => {
                    if ((e.target as HTMLInputElement).checked) {
                      updateFeature({
                        resistance: { type: "Psychic", amount: "-20" },
                      });
                    } else {
                      updateFeature({ resistance: undefined });
                    }
                  }}
                />
              )}
              <label
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                {!editing && feature.resistance
                  ? `resist: ${feature.resistance.type} ${feature.resistance.amount}`
                  : "resistance"}
              </label>
              {editing && feature.resistance && (
                <>
                  <select
                    value={feature.resistance.type}
                    onChange$={(e) => {
                      updateFeature({
                        resistance: {
                          ...feature.resistance!,
                          type: (e.target as HTMLSelectElement)
                            .value as PokemonType,
                        },
                      });
                    }}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {POKEMON_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={feature.resistance.amount}
                    onInput$={(e) => {
                      updateFeature({
                        resistance: {
                          ...feature.resistance!,
                          amount: (e.target as HTMLInputElement).value,
                        },
                      });
                    }}
                    style={{ width: "50px", fontSize: "0.75rem" }}
                    placeholder="-20"
                  />
                </>
              )}
            </div>

            {/* Retreat */}
            <LabeledInput
              label="retreat:"
              value={feature.retreatCost}
              onInput$={(value) => {
                const parsed = parseInt(value);
                if (!isNaN(parsed)) {
                  updateFeature({ retreatCost: parsed });
                }
              }}
              disabled={!editing}
              type="number"
              width="50px"
            />
          </InputGrid>

          {/* Card Details - sized for typical content lengths */}
          <InputGrid
            columns="minmax(100px, auto) minmax(80px, auto) minmax(60px, auto)"
            gap="calc(var(--spacing-unit) * 2)"
          >
            <input
              type="text"
              value={feature.illustrator || ""}
              onInput$={(e) =>
                updateFeature({
                  illustrator: (e.target as HTMLInputElement).value,
                })
              }
              placeholder="Illustrator"
              disabled={!editing}
              style={{
                fontSize: "0.65rem",
                fontFamily: "monospace",
                width: "100%",
              }}
            />
            <input
              type="text"
              value={feature.set || ""}
              onInput$={(e) =>
                updateFeature({ set: (e.target as HTMLInputElement).value })
              }
              placeholder="Set"
              disabled={!editing}
              style={{
                fontSize: "0.65rem",
                fontFamily: "monospace",
                width: "100%",
              }}
            />
            <input
              type="text"
              value={feature.rarity || ""}
              onInput$={(e) =>
                updateFeature({ rarity: (e.target as HTMLInputElement).value })
              }
              placeholder="Rarity"
              disabled={!editing}
              style={{
                fontSize: "0.65rem",
                fontFamily: "monospace",
                width: "100%",
              }}
            />
          </InputGrid>
        </div>
      </>
    );
  }
);
