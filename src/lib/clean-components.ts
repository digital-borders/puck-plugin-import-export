import type { ComponentData } from "@puckeditor/core";
import { traverseBlocks } from "./traverseBlocks";
import { v4 as uuidv4 } from "uuid";

export const cleanComponents = async (components: ComponentData[]) => {
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
