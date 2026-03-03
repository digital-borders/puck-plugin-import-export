# Puck Import / Export Plugin

[![npm version](https://img.shields.io/npm/v/@digital-borders/puck-plugin-import-export.svg)](https://www.npmjs.com/package/@digital-borders/puck-plugin-import-export)
[![npm downloads](https://img.shields.io/npm/dm/@digital-borders/puck-plugin-import-export.svg)](https://www.npmjs.com/package/@digital-borders/puck-plugin-import-export)
[![license](https://img.shields.io/npm/l/@digital-borders/puck-plugin-import-export.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Puck](https://img.shields.io/badge/Built%20for-Puck%20Editor-purple)](https://puckeditor.com)

A lightweight, extensible **Import / Export plugin for `@puckeditor/core`**, designed for modern frontend projects.

This plugin adds a clean UI panel to Puck that allows you to:

- **Export editor content as JSON**
- **Import JSON back into the editor**
- **Hook into the process** to transform blocks before import/export

---

## 📸 Screenshot

<p align="left">
  <img src="https://raw.githubusercontent.com/digital-borders/puck-plugin-import-export/main/screen/no-component-selected.png" width="35%" />
  <img src="https://raw.githubusercontent.com/digital-borders/puck-plugin-import-export/main/screen/component-selected.png" width="35%" />
</p>

---

## ✨ Features

- 🔁 Import / Export Puck content as JSON
- 🛠️ Transform blocks before export and before import
- ⚛️ React 18 / 19 compatible
- 🧪 Fully typed with TypeScript

---

## 📦 Installation

```bash
npm install @digital-borders/puck-plugin-import-export
```

Peer dependencies (must be installed in the host project):

```bash
npm install react @puckeditor/core
```

---

## 🚀 Usage

### 1. Import the plugin

```ts
import { createImportExportPlugin } from "@digital-borders/puck-plugin-import-export";
```

### 2. Create the plugin instance

```ts
const importExportPlugin = createImportExportPlugin({
  onBeforeExport: (blocks) => {
    // Example: remove readOnly flags
    return blocks.map(({ readOnly, ...rest }) => rest);
  },

  onBeforeImport: (blocks) => {
    // Example: filter out debug-only blocks
    return blocks.filter((block) => block.type !== "DebugBlock");
  },
});
```

### 3. Register it in Puck

```tsx
import { Puck } from "@puckeditor/core";
import "@digital-borders/puck-plugin-import-export/styles.css";

function Editor() {
  return <Puck config={config} plugins={[importExportPlugin]} />;
}
```

---

## 🧠 API

### `createImportExportPlugin(options)`

```ts
type ImportExportPluginOptions = {
  onBeforeExport?: (blocks: ComponentData[]) => ComponentData[];
  onBeforeImport?: (blocks: ComponentData[]) => ComponentData[];
};
```

#### Hooks

- **`onBeforeExport`**
  Called right before exporting data.
  Useful for cleanup, normalization, migrations, or filtering.

- **`onBeforeImport`**
  Called right before importing data into Puck.
  Useful for schema migrations, ID regeneration, or compatibility fixes.

---

## 🎨 Styling & CSS

This plugin uses **Tailwind CSS + shadcn/ui** for styling, but you can easily customize it:

- CSS is shipped as a separate file

```ts
import "@digital-borders/puck-plugin-import-export/styles.css";
```

Styles are scoped to the plugin root (`.pp-root`) and do not apply globally.

If you want to customize themes, you can override CSS variables on the plugin root.

---

## 🛠️ Development

### Prerequisites

- Node.js v22.18.0 (managed with `.nvm`)

### Install dependencies

```bash
npm install
```

### Run type checking

```bash
npm run typecheck
```

### Lint the source

```bash
npm run lint
```

### Build the library

```bash
npm run build
```

This will generate:

- ESM + CJS bundles
- Type declarations
- Tailwind CSS output

---

## 🧪 Tech Stack

- TypeScript
- React
- @puckeditor/core
- Tailwind CSS
- shadcn/ui
- Radix UI
- tsup

---

## 🤝 Contributing

Contributions are **very welcome** ❤️

Whether you want to:

- fix a bug
- improve the UI
- add new import/export options
- improve documentation
- propose new plugin ideas

Feel free to:

1. Fork the repo
2. Create a feature branch
3. Open a Pull Request

If you’re unsure where to start, open an issue — discussions are encouraged.

---

## 📄 License

MIT © Contributors

---

## ⭐ Acknowledgements

Built for the Puck ecosystem and inspired by real-world editor workflows.

If you find this plugin useful, consider giving the repo a ⭐️
and sharing it with your fellow developers!
