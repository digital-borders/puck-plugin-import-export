import { Puck, type Config, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { createImportExportPlugin } from "../dist/puck-plugin-import-export.js";
import "../dist/puck-plugin-import-export.css";

const importExportPlugin = createImportExportPlugin({
  onBeforeExport: async (blocks) => {
    // Example: handle the export of data
    console.log("Exporting data:", blocks);
  },

  onBeforeImport: async (data) => {
    // Example: handle the import of data
    console.log("Importing data:", data);
  },
});

type Props = {
  HeadingBlock: { title: string };
};

const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
    },
  },
};

export function Client({ data }: { data: Partial<Data> }) {
  return (
    <Puck
      config={config}
      data={data}
      plugins={[importExportPlugin]}
      onPublish={async (data) => {
        console.log("Published data:", data);
      }}
    />
  );
}
