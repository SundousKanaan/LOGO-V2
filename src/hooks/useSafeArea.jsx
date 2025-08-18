import { useState, useEffect } from "react";
import { SafeArea } from "capacitor-plugin-safe-area";

export const useSafeArea = () => {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    async function fetchInsets() {
      try {
        const result = await SafeArea.getSafeAreaInsets();
        setInsets(result.insets);
      } catch (e) {
        console.warn("SafeArea plugin error", e);
      }
    }

    fetchInsets();
  }, []);

  return { insets };
};
