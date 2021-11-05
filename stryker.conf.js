/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = function(config) {
  config.set({
    // mutate: ["src/domain/*.ts","!*spec.ts"],
    mutate: ["src/domain/player.ts"],
    mutator: "typescript",
    testRunner: "jest",
    reporters: ["progress", "clear-text", "html"],
    coverageAnalysis: "off",
    jest: {
      projectType: "custom",

      config: require("./jest.config.js"),
    },
    timeoutMS: 60000,
    maxConcurrentTestRunners: 4,
  })
}
