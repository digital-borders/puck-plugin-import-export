import { createUsePuck } from "@puckeditor/core";
import { ArrowUpDown } from "lucide-react";
import {
  ImportExportPlugin,
  type ImportExportPluginOptions,
} from "./components/import-export";
import type { ReactElement } from "react";

const usePuck = createUsePuck();

export function createImportExportPlugin(options: ImportExportPluginOptions) {
  const { onBeforeExport, onBeforeImport } = options;
  const PluginWrapper = () => {
    const isOpened = usePuck(
      (s) => s.appState.ui.plugin.current === "@digitalborders/import-export",
    );

    if (!isOpened) {
      return null as unknown as ReactElement; // Return null when the plugin is not active
    }

    return (
      <ImportExportPlugin
        onBeforeExport={onBeforeExport}
        onBeforeImport={onBeforeImport}
      />
    );
  };

  return {
    name: "@digitalborders/import-export",
    label: "In/Out",
    icon: <ArrowUpDown />,

    render: PluginWrapper,
  };
}
