import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { APP_STATE_CTX } from "~/store/appStore";
import { FeatureCard } from "~/components/FeatureCard";
import { useContextCursor } from "~/hooks/useContextCursor";
import type { Feature } from "~/types/data";

export default component$(() => {
  const [features, featuresCursor] = useContextCursor(APP_STATE_CTX, [
    "features",
  ]);

  // Sort features by ID
  const sortedFeatures = [...features].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div
      style={{ padding: "calc(var(--spacing-unit) * 8)", maxWidth: "800px" }}
    >
      <div style={{ marginBottom: "calc(var(--spacing-unit) * 6)" }}>
        <Link href="/">Back</Link>
      </div>

      <h1>Features</h1>

      <button
        class="primary"
        onClick$={() => {
          const newId = String(features.length + 1);
          const newFeature = {
            id: newId,
            name: `Feature ${newId}`,
            description: "New feature description",
          };

          featuresCursor.swap((features: Feature[]) => [
            ...features,
            newFeature,
          ]);
        }}
        style={{
          marginBottom: "calc(var(--spacing-unit) * 6)",
        }}
      >
        Add Feature
      </button>

      <div>
        <p
          style={{
            fontSize: "0.875rem",
            marginBottom: "calc(var(--spacing-unit) * 4)",
          }}
        >
          {sortedFeatures.length} total
        </p>
        {sortedFeatures.map((f) => (
          <FeatureCard key={f.id} feature={f} />
        ))}
      </div>
    </div>
  );
});
