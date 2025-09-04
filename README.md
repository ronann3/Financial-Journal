# Smart Financial Journal

## Overview

The Smart Financial Journal is a daily journaling app designed to help users **reflect on their spending habits** and make better financial decisions. Users log daily transactions, face each purchase head-on, and provide justifications for their spending.

## Features

- **Daily Transaction Logging:** Input purchases, categorize them, and add personal notes.
- **AI-Powered Reflection:** Gemini AI analyzes transactions in context, identifying essential, justified, and wasteful spends.
- **First-Person Self-Critique:** Feedback is written in the user’s voice, highlighting spending patterns, emotional purchases, and areas for improvement.
- **Daily Performance Score:** Generates a concise metric to evaluate financial decisions.
- **Progress Tracking:** Users can monitor their scores over time to see improvements in spending behavior.

## Purpose

The app encourages **self-awareness, better judgment, and motivation** by helping users understand the impact of their spending — not only financially, but also on their well-being and lifestyle.

## Tech Stack

- **Frontend:** React.js, Next.js, Tailwind CSS
- **Backend:** Firebase Firestore, Firebase Auth, Firebase Functions
- **AI Integration:** Gemini AI for reflective analysis and scoring

## Presentation: 
https://youtu.be/WxFnXHIiDSw

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
