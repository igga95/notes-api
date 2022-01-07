module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {
        indent: ["warn", 4],
        "linebreak-style": ["warn", "unix"],
        quotes: ["warn", "double"],
        semi: ["warn", "always"],
        "no-unused-vars": [
            "warn",
            {
                vars: "all",
                args: "all",
            },
        ],
        "no-prototype-builtins": "off",
    },
};
