import {
  createSystem,
  defaultConfig,
  defineLayerStyles,
} from "@chakra-ui/react";

const layerStyles = defineLayerStyles({
  dashboardCardsLayaout: {
    description: "Dashboard cards layout",
    value: {
      w: "100%",
      h: "100%",
      p: "20px 24px",
      bg: "white",
      borderRadius: "24px",
    },
  },
});

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "Urbanist, sans-serif" },
        body: { value: "Inter, sans-serif" },
      },
      colors: {
        themeColor: { value: "#6f6cf3" },
        secondaryColor: { value: "#161819" },
        lightGray: { value: "#f6f6f8" },
        lightGray2: { value: "#f1f1f1" },
        lightBlue: { value: "#F4F6F7" },
        infoNotic: { value: "#ff4a4a" },
        risingColor: { value: "#42AA65" },
        lightrRisingColor: { value: "#EBFDEF" },
        fallingColor: { value: "#ff4a4a" },
        lightFallingColor: { value: "#FDE8E8" },
        lightBlack: { value: "#00000050" },
      },
    },
    layerStyles,
  },
});
