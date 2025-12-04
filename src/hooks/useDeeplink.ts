import { useSignal, useVisibleTask$, type Signal } from "@qwik.dev/core";

export interface DeeplinkResult {
  isHighlighted: Signal<boolean>;
  cardRef: Signal<HTMLElement | undefined>;
}

/**
 * Hook for handling deeplink navigation via URL hash.
 * Automatically scrolls to and highlights an element when its ID matches the URL hash.
 *
 * @param id - The unique identifier to match against the URL hash
 * @param highlightDuration - Duration in milliseconds to show the highlight (default: 2000)
 * @returns Object containing isHighlighted signal and cardRef signal for the element
 */
export const useDeeplink = (
  id: string,
  highlightDuration: number = 2000
): DeeplinkResult => {
  const isHighlighted = useSignal(false);
  const cardRef = useSignal<HTMLElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(() => id);

    const checkHash = () => {
      const hash = window.location.hash.slice(1); // Remove the # character
      if (hash === id) {
        isHighlighted.value = true;
        // Scroll to the element
        cardRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
        // Remove highlight after duration
        const timeout = setTimeout(() => {
          isHighlighted.value = false;
        }, highlightDuration);
        cleanup(() => clearTimeout(timeout));
      } else {
        isHighlighted.value = false;
      }
    };

    // Check on mount
    checkHash();

    // Listen for hash changes
    window.addEventListener("hashchange", checkHash);
    cleanup(() => window.removeEventListener("hashchange", checkHash));
  });

  return { isHighlighted, cardRef };
};
