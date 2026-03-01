import { createUsePuck } from "@puckeditor/core";
import { ArrowUpDown } from "lucide-react";
import {
  ImportExportPlugin,
  ImportExportPluginOptions,
} from "./components/ImportExport";

const usePuck = createUsePuck();

export function createImportExportPlugin(
  options: ImportExportPluginOptions = {},
) {
  const {
    onBeforeExport,
    onBeforeImport,
    // fileName = "puck-export.json",
    // includeRoot = true,
    // className,
  } = options;

  const PluginWrapper = () => {
    const isOpened = usePuck(
      (s) => s.appState.ui.plugin.current === "import-export",
    );

    if (!isOpened) {
      return null;
    }

    return (
      <ImportExportPlugin
        onBeforeExport={onBeforeExport}
        onBeforeImport={onBeforeImport}
      />
    );
  };

  return {
    name: "import-export",
    label: "In/Out",
    icon: <ArrowUpDown />,

    render: PluginWrapper,
  };
}
