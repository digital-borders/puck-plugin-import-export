"use client";

import { Badge } from "@ui/badge";
import { Button } from "@puckeditor/core";
import { Label } from "@ui/label";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { ScrollArea } from "@ui/scroll-area";
import { Separator } from "@ui/separator";
import { Textarea } from "@ui/textarea";
import { ComponentData, createUsePuck, useGetPuck } from "@puckeditor/core";

import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileJson,
  Upload,
} from "lucide-react";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { traverseBlocks } from "@lib/traverseBlocks";

export type ImportExportPluginOptions = {
  onBeforeExport?: (content: ComponentData[]) => Promise<ComponentData[]>;
  onBeforeImport?: (content: ComponentData[]) => Promise<ComponentData[]>;
  // fileName?: string;
  // includeRoot?: boolean;
  // className?: string;
};

const cleanComponents = async (components: ComponentData[]) => {
  const cleanBlocks = await traverseBlocks(
    components,
    () => {},
    (block) => {
      const { type, props } = block;
      const { id, ...allProps } = props;
      return {
        type,
        props: {
          ...allProps,
          // Generate a new id for the imported block
          id: `${id.split("-")[0]}-${uuidv4()}`,
        },
      };
    },
  );
  return cleanBlocks;
};

const validateComponent = (component: ComponentData): boolean => {
  return !!(component.type && component.props);
};

const usePuck = createUsePuck();

export function ImportExportPlugin(props: ImportExportPluginOptions) {
  const { onBeforeExport, onBeforeImport } = props;

  const selectedItem = usePuck((s) => s.selectedItem);

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<"idle" | "success">("idle");

  const handleExportComponent = async () => {
    if (!selectedItem) return;

    setIsExporting(true);

    try {
      let contentToExport = selectedItem;
      if (onBeforeExport) {
        contentToExport = (await onBeforeExport([contentToExport]))[0];
      }

      const jsonData = JSON.stringify(contentToExport, null, 2);

      await navigator.clipboard.writeText(jsonData);
      console.log("Exported component to clipboard:", contentToExport);
      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!selectedItem) {
    return (
      <div className="pp-root bg-background flex h-full flex-col">
        <Heading />

        {/* Export All - Always Available */}

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4">
            <ExportAll />

            <Separator />

            <div className="border-border rounded-lg border border-dashed p-6 text-center">
              <FileJson className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                Select a component to enable import and export individual
                component options.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="pp-root bg-background flex h-full flex-col">
      {/* Header */}
      <div className="border-border border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            <FileJson className="text-primary-foreground h-4 w-4" />
          </div>
          <h2 className="text-foreground font-semibold">Import/Export</h2>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          Export and import components as JSON data.
        </p>
      </div>

      <div className="space-y-6 p-4">
        {/* Export All */}
        <ExportAll />
      </div>

      <Separator />

      {/* Component Info */}
      <div className="border-border border-b border-t px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Selected Component
            </p>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {selectedItem?.type}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Export Component */}
          <div>
            <h3 className="text-foreground mb-3 text-sm font-semibold">
              Export Component
            </h3>
            <p className="text-muted-foreground mb-3 text-xs">
              Copy the selected component as JSON to your clipboard.
            </p>
            <Button onClick={handleExportComponent} fullWidth>
              {exportStatus === "success" ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Copied to Clipboard!
                </>
              ) : isExporting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Exporting...
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Export This Component
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Import Component */}
          <ImportComponent
            selectedItem={selectedItem}
            onBeforeImport={onBeforeImport}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

const ImportComponent = ({
  selectedItem,
  onBeforeImport,
}: {
  selectedItem: ComponentData;
  onBeforeImport?: (components: ComponentData[]) => Promise<ComponentData[]>;
}) => {
  const getPuck = useGetPuck();
  const puckDispatch = usePuck((s) => s.dispatch);
  const [importJson, setImportJson] = useState("");
  const [insertPosition, setInsertPosition] = useState<"before" | "after">(
    "after",
  );
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string>("");
  const handleImportComponent = useCallback(async () => {
    setImportError("");
    setIsImporting(true);

    if (!importJson.trim()) {
      setImportError("Please paste JSON data to import");
      setIsImporting(false);
      return;
    }

    try {
      const parsed = JSON.parse(importJson);

      // Check if it's an array or single object
      const isArray = Array.isArray(parsed);
      let components = isArray ? parsed : [parsed];

      // Validate all components
      for (let i = 0; i < components.length; i++) {
        if (!validateComponent(components[i])) {
          setImportError(
            `Invalid component at index ${i}. Missing required "type" or "props" properties.`,
          );
          setIsImporting(false);
          return;
        }
      }

      console.log("Getting Puck state for import...");

      if (onBeforeImport) {
        components = await onBeforeImport(components);
      }

      // Get the latest PuckApi value
      const { appState } = getPuck();

      console.log("Current Puck appState:", appState);

      // Clean all components (remove props.id)
      const cleanedComponents = await cleanComponents(components);

      console.log("Components cleaned", cleanedComponents, selectedItem);

      // this map is usefull if the user try to  import the same component inside itself, to avoid infinite loop of substitution
      const substitutedMap = new Map<string, boolean>();

      const newBlocks = await traverseBlocks(
        appState.data.content,
        () => {},
        (block) => {
          if (substitutedMap.get(block.props.id)) {
            return block;
          }

          const { props } = block;
          const { id } = props;
          if (id !== selectedItem.props.id) {
            return block;
          }
          substitutedMap.set(id, true);
          if (insertPosition === "before") {
            return [...cleanedComponents, block];
          }
          return [block, ...cleanedComponents];
        },
      );

      console.log("New blocks:", newBlocks);

      puckDispatch({
        type: "setData",
        data: (previous) => {
          return {
            ...previous,
            content: newBlocks,
          };
        },
      });

      console.log("Importing completed:", cleanedComponents);

      setImportJson("");
    } catch (error) {
      setImportError("Invalid JSON format. Please check your input.");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  }, [
    getPuck,
    puckDispatch,
    importJson,
    insertPosition,
    selectedItem,
    setIsImporting,
    onBeforeImport,
  ]);

  return (
    <div>
      <h3 className="text-foreground mb-3 text-sm font-semibold">
        Import Component
      </h3>
      <p className="text-muted-foreground mb-3 text-xs">
        Paste JSON data to import a component or an array of components.
      </p>

      <div className="space-y-3">
        <div>
          <Label htmlFor="import-json" className="text-sm">
            Component JSON
          </Label>
          <Textarea
            id="import-json"
            placeholder='{"type": "Button", "props": {...}} or [{"type": "Button", ...}, ...]'
            value={importJson}
            onChange={(e) => {
              setImportJson(e.target.value);
              setImportError("");
            }}
            className="mt-1.5 max-h-50 min-h-30 resize-none overflow-y-auto font-mono text-xs"
          />
          {importError && (
            <p className="text-destructive mt-1.5 flex items-center gap-1 text-xs">
              <AlertTriangle className="h-3 w-3" />
              {importError}
            </p>
          )}
        </div>

        <div>
          <Label className="text-sm">Insert Position</Label>
          <RadioGroup
            value={insertPosition}
            onValueChange={(value) =>
              setInsertPosition(value as "before" | "after")
            }
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="before" id="before" />
              <Label htmlFor="before" className="text-sm font-normal">
                Before &quot;{selectedItem?.type}&quot;
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="after" id="after" />
              <Label htmlFor="after" className="text-sm font-normal">
                After &quot;{selectedItem?.type}&quot;
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={handleImportComponent}
          fullWidth
          disabled={isImporting}
        >
          {isImporting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import Component
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const ExportAll = () => {
  const getPuck = useGetPuck();

  const [exportStatus, setExportStatus] = useState<"idle" | "success">("idle");

  const handleExportAll = useCallback(async () => {
    // Get the latest PuckApi value
    const { appState } = getPuck();
    console.log("Current Puck appState:");
    const jsonData = JSON.stringify(appState.data.content, null, 2);

    try {
      await navigator.clipboard.writeText(jsonData);
      console.log("Exported all components to clipboard:");
      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, [getPuck]);

  return (
    <div>
      <h3 className="text-foreground mb-4 text-sm font-semibold">
        Export All Components
      </h3>
      <p className="text-muted-foreground mb-4 text-xs">
        Export all components in your project to JSON format.
      </p>
      <Button onClick={handleExportAll} fullWidth>
        {exportStatus === "success" ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Copied to Clipboard!
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Export All Components
          </>
        )}
      </Button>
    </div>
  );
};

const Heading = () => {
  return (
    <div className="border-border border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
          <FileJson className="text-primary-foreground h-4 w-4" />
        </div>
        <h2 className="text-foreground font-semibold">Import/Export</h2>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        Export and import components as JSON data.
      </p>
    </div>
  );
};
