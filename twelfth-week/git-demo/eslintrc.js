module.exports = {
    root: true,
    env: {
      node: true,
      "es2021": true
    },
    extends: [
      "plugin:vue/essential",
      "eslint:recommended",
      "@vue/typescript/recommended",
      "@vue/prettier",
      "@vue/prettier/@typescript-eslint"
    ],
    parserOptions: {
      ecmaVersion: 2020
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "vue/no-unused-vars": "off"
    },
    overrides: [
      {
        files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
        env: {
          jest: true
        }
      }
    ]
  };
  