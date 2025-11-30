import { component$, Slot } from "@builder.io/qwik";
import { DevBar } from "~/components/DevBar";

export default component$(() => {
  return (
    <>
      <Slot />
      {/* {import.meta.env.DEV && <DevBar />} */}
      <DevBar />
    </>
  );
});
