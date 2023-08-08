import type { LayoutLoad } from "./$types";

// export const ssr = false;

export const load = (async () => {
  const auth = await import("../firebase/auth");

  return {
    auth,
  };
}) satisfies LayoutLoad;
