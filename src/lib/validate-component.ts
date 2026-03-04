import type { ComponentData } from "@puckeditor/core";

export const validateComponent = (component: ComponentData): boolean => {
  return !!(component.type && component.props);
};
