module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:jest/recommended",
  ],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "@typescript-eslint/no-var-requires": 0,
  },
};
