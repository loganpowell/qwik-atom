import { component$, useContext } from "@builder.io/qwik";
import type { Feature } from "~/types/data";
import { APP_STATE_CTX } from "~/store/appStore";
import { useContextCursor } from "~/hooks/useContextCursor";

export const FeatureCard = component$<{ feature: Feature }>(({ feature }) => {
  const [_, featuresCursor] = useContextCursor(APP_STATE_CTX, ["features"]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h4>{feature.name}</h4>
      <p>{feature.description}</p>
      <input
        type="text"
        value={feature.name}
        onInput$={(e) => {
          const newName = (e.target as HTMLInputElement).value;

          featuresCursor.swap((features: Feature[]) =>
            features.map((f) =>
              f.id === feature.id ? { ...f, name: newName } : f
            )
          );
        }}
      />
      <button
        onClick$={() => {
          featuresCursor.swap((features: Feature[]) =>
            features.filter((f) => f.id !== feature.id)
          );
        }}
        style={{
          marginTop: "5px",
          padding: "5px 10px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
});
