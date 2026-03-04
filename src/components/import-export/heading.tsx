import { FileJson } from "lucide-react";

export const Heading = () => {
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
