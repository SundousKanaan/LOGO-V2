import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Provider } from "./components/ui/provider";
import App from "./App";
import { system } from "./global/theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider theme={system}>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.StrictMode>
    </QueryClientProvider>
  </Provider>
);
