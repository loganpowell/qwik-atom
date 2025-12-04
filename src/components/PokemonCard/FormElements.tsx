import {
  component$,
  type QRL,
  useSignal,
  useVisibleTask$,
  Slot,
} from "@qwik.dev/core";

// Auto-sizing text input that adjusts font size to fit
export const AutoSizeInput = component$<{
  value: string;
  onInput$: QRL<(value: string) => void>;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  minFontSize?: number;
  maxFontSize?: number;
  fontWeight?: string;
}>(
  ({
    value,
    onInput$,
    placeholder,
    disabled,
    maxLength = 20,
    minFontSize = 0.75,
    maxFontSize = 1.25,
    fontWeight = "900",
  }) => {
    const fontSize = useSignal(maxFontSize);

    useVisibleTask$(({ track }) => {
      track(() => value);
      // Calculate font size based on text length
      const length = value.length || placeholder?.length || 0;
      const scaleFactor = Math.max(0, 1 - (length - 10) / 20);
      const calculated =
        minFontSize + (maxFontSize - minFontSize) * scaleFactor;
      fontSize.value = Math.max(minFontSize, Math.min(maxFontSize, calculated));
    });

    return (
      <input
        type="text"
        value={value}
        onInput$={(e) => onInput$((e.target as HTMLInputElement).value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        style={{
          fontSize: `${fontSize.value}rem`,
          fontWeight,
          border: "none",
          background: "transparent",
          padding: "0",
          width: "100%",
          outline: "none",
          fontFamily: "inherit",
          color: "inherit",
          cursor: disabled ? "default" : "text",
        }}
      />
    );
  }
);

// Slider that looks like bar visualization
export const BarSlider = component$<{
  value: number;
  max?: number;
  onInput$: QRL<(value: number) => void>;
  disabled?: boolean;
  label?: string;
}>(({ value, max = 200, onInput$, disabled, label }) => {
  const bars = 20;
  const filledBars = Math.round((value / max) * bars);

  return (
    <div style={{ display: "grid", gap: "calc(var(--spacing-unit) * 0.5)" }}>
      {label && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-secondary)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{label}</span>
          <span>{value}</span>
        </div>
      )}
      <div style={{ position: "relative" }}>
        {/* Visual bar display */}
        <div
          style={{
            display: "flex",
            gap: "2px",
            height: "24px",
            alignItems: "flex-end",
          }}
        >
          {Array.from({ length: bars }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background:
                  i < filledBars
                    ? "var(--color-text-primary)"
                    : "var(--color-border)",
                transition: "background 0.2s ease",
                opacity: i < filledBars ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        {/* Invisible range input overlay */}
        {!disabled && (
          <input
            type="range"
            min="0"
            max={max}
            value={value}
            onInput$={(e) =>
              onInput$(parseInt((e.target as HTMLInputElement).value))
            }
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
        )}
      </div>
    </div>
  );
});

// Compact input with label
export const LabeledInput = component$<{
  label: string;
  value: string | number;
  onInput$: QRL<(value: string) => void>;
  disabled?: boolean;
  type?: "text" | "number";
  width?: string;
  placeholder?: string;
}>(
  ({ label, value, onInput$, disabled, type = "text", width, placeholder }) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "0.75rem",
        }}
      >
        <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
        <input
          type={type}
          value={value}
          onInput$={(e) => onInput$((e.target as HTMLInputElement).value)}
          disabled={disabled}
          placeholder={placeholder}
          style={{
            border: "none",
            background: "transparent",
            padding: "0",
            width: width || "auto",
            outline: "none",
            fontFamily: "inherit",
            fontSize: "inherit",
            color: "inherit",
            cursor: disabled ? "default" : "text",
          }}
        />
      </div>
    );
  }
);

// Grid-based input group
export const InputGrid = component$<{
  columns?: string;
  gap?: string;
}>(({ columns = "1fr", gap = "calc(var(--spacing-unit) * 2)" }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gap,
        alignItems: "center",
      }}
    >
      <Slot />
    </div>
  );
});
