import { colorsPalette } from "../global/theme";
export const UsePickRandomColor = (name) => {
  const index = name.charCodeAt(0) % colorsPalette.length;
  return colorsPalette[index];
};
