import { colorsPalette } from "../global/theme";
export const UsePickRandomColor = (name) => {
  if (typeof name !== "string" || name.length === 0) {
    return colorsPalette[0];
  }
  const index = name.charCodeAt(0) % colorsPalette.length;
  return colorsPalette[index];
};
