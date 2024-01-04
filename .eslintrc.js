module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs", "node_modules"],
    parser: "@typescript-eslint/parser",
    plugins: ["react-refresh", "react-hooks", "prettier"],
    rules: {
        eqeqeq: "error",
        quotes: ["error", "double"],
        semi: ["warn", "always"],

        "format-on-save": "on",
        "no-unused-vars": "on",
        "unused-imports/no-unused-imports": "on",
        "@typescript-eslint/no-unused-vars": "on",
        "unused-imports/no-unused-imports-ts": "on",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_",
            },
        ],
        "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
        ],
    },
};
