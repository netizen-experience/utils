async function getConfig() {
  const {
    default: {
      utils: { getProjects },
    },
  } = await import("@commitlint/config-nx-scopes");

  /** @type {import('@commitlint/types').UserConfig} */
  const config = {
    extends: ["@commitlint/config-conventional"],
    rules: {
      "scope-enum": async (ctx) => [2, "always", [...(await getProjects(ctx, () => true)), "release"]],
      "subject-case": [2, "always", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    },
  };

  return config;
}

export default getConfig();
