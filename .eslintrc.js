// /apps/api/.eslintrc.js

module.exports = {
  extends: ["../../.eslintrc.js"],
  env: {
    node: true,
  },
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2023,
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
  },
};
