import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",

      globals: {
        ...globals.node
      }
    },

    rules: {
      semi: [
        "error",
        "always"
      ],

      quotes: [
        "error",
        "double"
      ],

      indent: [
        "error",
        2
      ],

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none"
        }
      ],

      "no-console": "off"
    }
  },

  {
    files: [
      "public/js/**/*.js"
    ],

    languageOptions: {
      globals: {
        ...globals.browser,

        apiFetch: "readonly",
        requireSession: "readonly",
        cerrarSesion: "readonly"
      }
    }
  }
];