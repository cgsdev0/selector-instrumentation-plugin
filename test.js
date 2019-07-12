const pluginTester = require("babel-plugin-tester");
const selectorInstrumentationPlugin = require("../selector-instrumentation-plugin");

pluginTester({
  plugin: selectorInstrumentationPlugin,
  pluginName: "selectorInstrumentationPlugin",
  title: "selectorInstrumentationPlugin",
  tests: [
    {
      code: `export const selectNothing = createSelector();`,
      snapshot: true,
    },
    {
        code: `export const selectState = createSelector(state, state => state.get("stuff"));`,
      snapshot: true,
    },
    {
        code: `import { defaultMemoize } from "reselect";`,
        snapshot: false,
    },
    {
        code: `import { createSelector as reselectCreateSelector } from "reselect";`,
        snapshot: false,
    },
    {
        code: `import "reselect";`,
        snapshot: false,
    },
    {
        code: `import { createSelector } from "reselect";`,
        snapshot: true,
    },
    {
        code: `import { defaultMemoize, createSelector } from "reselect";`,
        snapshot: true,
    },
    {
        code: `export const selectFromMultipleThings = createSelector(selectFrom1, selectFrom2, selectFrom3, (t1, t2, t3) => t1 + t2 / t3);`,
        snapshot: true,
    },
  ],
});
