import { cleanComponents } from "@/lib/clean-components";
import { traverseBlocks } from "@/lib/traverseBlocks";
import { validateComponent } from "@/lib/validate-component";
import {
  Button,
  createUsePuck,
  useGetPuck,
  type ComponentData,
} from "@puckeditor/core";
import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Upload } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const usePuck = createUsePuck();

export const Import = ({
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
