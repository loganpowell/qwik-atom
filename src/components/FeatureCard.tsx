import { component$, useSignal, $ } from "@qwik.dev/core";
import type { Feature } from "~/types/data";
import { APP_STATE_CTX } from "~/store/appStore";
import { useContextCursor } from "~/hooks/useContextCursor";
import { useDeeplink } from "~/hooks/useDeeplink";
import { UnifiedPokemonCard } from "./PokemonCard/UnifiedPokemonCard";

export const FeatureCard = component$<{ feature: Feature }>(({ feature }) => {
  const [, featuresCursor] = useContextCursor(APP_STATE_CTX, ["features"]);
  const { isHighlighted, cardRef } = useDeeplink(feature.id);
  const showCopied = useSignal(false);
  const isEditing = useSignal(false);

  const updateFeature = $((updates: Partial<Feature>) => {
    featuresCursor.swap((features: Feature[]) =>
      features.map((f) => (f.id === feature.id ? { ...f, ...updates } : f))
    );
  });

  const deleteFeature = $(() => {
    featuresCursor.swap((features: Feature[]) =>
      features.filter((f) => f.id !== feature.id)
    );
  });

  const copyLink = $(() => {
    const url = `${window.location.pathname}#${feature.id}`;
    navigator.clipboard.writeText(window.location.origin + url);
    showCopied.value = true;
    setTimeout(() => {
      showCopied.value = false;
    }, 1500);
  });

  return (
    <div
      id={feature.id}
      ref={cardRef}
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "calc(var(--spacing-unit) * 3)",
        paddingBottom: "calc(var(--spacing-unit) * 3)",
        display: "grid",
        gap: "calc(var(--spacing-unit) * 3)",
        backgroundColor: isHighlighted.value
          ? "var(--color-highlight, rgba(255, 255, 0, 0.1))"
          : "transparent",
        transition: "background-color 0.3s ease",
        scrollMarginTop: "calc(var(--spacing-unit) * 4)",
        position: "relative",
      }}
    >
      {/* Unified component that handles both view and edit modes */}
      <UnifiedPokemonCard
        feature={feature}
        onUpdate={updateFeature}
        onDelete={deleteFeature}
        isEditing={isEditing}
        isHighlighted={isHighlighted}
        showCopied={showCopied}
        onCopyLink={copyLink}
      />
    </div>
  );
});
