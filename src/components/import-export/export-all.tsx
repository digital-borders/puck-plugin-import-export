import { Button, useGetPuck } from "@puckeditor/core";
import { CheckCircle2, Download } from "lucide-react";
import { useCallback, useState } from "react";

export const ExportAll = () => {
  const getPuck = useGetPuck();

  const [exportStatus, setExportStatus] = useState<"idle" | "success">("idle");

  const handleExportAll = useCallback(async () => {
    // Get the latest PuckApi value
    const { appState } = getPuck();
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
