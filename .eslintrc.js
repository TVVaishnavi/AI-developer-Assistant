export default [
    {
      files: ["*.ts", "*.tsx"],
      languageOptions: {
        parser: "@typescript-eslint/parser",
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
        },
      },
      plugins: ["@typescript-eslint", "prettier", "jest"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "prettier",
      ],
      env: {
        node: true,
        es6: true,
        jest: true, // Ensures Jest functions are recognized
      },
      rules: {
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "prettier/prettier": "error",
        "no-undef": "off",
      },
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        test: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  ];
  