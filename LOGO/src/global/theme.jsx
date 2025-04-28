import {
  createSystem,
  defaultConfig,
  defineLayerStyles,
} from "@chakra-ui/react";

const layerStyles = defineLayerStyles({
  dashboardCardsLayout: {
    description: "Dashboard cards layout",
    value: {
      w: "100%",
      h: "100%",
      p: "20px 24px",
      bg: "white",
      borderRadius: "24px",
    },
  },
  ProductCardsListGridLayout: {
    description: "Product cards grid layout",
    value: {
      display: "grid",
      gridTemplateColumns: {
        base: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
        "2xl": "repeat(5, 1fr)",
      },
      gap: "24px",
    },
  },

  ProductCardsListLayout: {
    description: "Product cards list layout",
    value: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
  },

  ProductCardGridLayout: {
    description: "Product card grid layout",
    value: {
      w: "100%",
      h: "100%",
      display: "Grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "243px auto",
      gap: "12px",
      padding: "16px",
      bg: "white",
      borderRadius: "24px",
      position: "relative",
      border: "none",
    },
  },

  ProductCardListLayout: {
    description: "Product card list layout",
    value: {
      w: "100%",
      h: "100%",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "12px",
      padding: "16px",
      bg: "white",
      borderRadius: "24px",
      border: "none",
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
        lightBlack: { value: "#00000050" },

        statusRed: { value: "#ff4a4a" },
        statusRedLight: { value: "#FDE8E8" },
        statusGreen: { value: "#42AA65" },
        statusGreenLight: { value: "#EBFDEF" },

        statusOrange: { value: "#FF9600" },
        statusOrangeLight: { value: "#FFEFE7" },
      },
    },
    layerStyles,
  },
});
