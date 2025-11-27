import { component$, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { APP_STATE_CTX } from "~/store/appStore";
import { FeatureCard } from "~/components/FeatureCard";
import { useContextCursor } from "~/hooks/useContextCursor";

export default component$(() => {
  const [count, countCursor] = useContextCursor(APP_STATE_CTX, ["count"]);
  const [features] = useContextCursor(APP_STATE_CTX, ["features"]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Toy App</h1>

      <div style={{ marginBottom: "20px" }}>
        <p>Count: {count}</p>
        <button
          onClick$={() => {
            countCursor.swap((c: number) => c + 1);
          }}
        >
          Increment
        </button>
      </div>

      <hr />

      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/features"
          style={{
            padding: "10px 20px",
            background: "#2196F3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          View All Features →
        </Link>
      </div>

      <h2>Recent Features</h2>
      <p>
        Showing {Math.min(3, features.length)} of {features.length} features
      </p>
      {features.slice(0, 3).map((f) => (
        <FeatureCard key={f.id} feature={f} />
      ))}
    </div>
  );
});
