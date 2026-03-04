import { Button, createUsePuck, type ComponentData } from "@puckeditor/core";
import { useState } from "react";
import { Heading } from "./import-export/heading";
import { ScrollArea } from "./ui/scroll-area";
import { ExportAll } from "./import-export/export-all";
import { Separator } from "./ui/separator";
import { CheckCircle2, Copy, FileJson } from "lucide-react";
import { Import } from "./import-export/import";
import { Badge } from "./ui/badge";

export type ImportExportPluginOptions = {
  onBeforeExport?: (content: ComponentData[]) => Promise<ComponentData[]>;
  onBeforeImport?: (content: ComponentData[]) => Promise<ComponentData[]>;
  // fileName?: string;
  // includeRoot?: boolean;
  // className?: string;
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
          <Import selectedItem={selectedItem} onBeforeImport={onBeforeImport} />
        </div>
      </ScrollArea>
    </div>
  );
}
