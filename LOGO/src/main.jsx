import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "./components/ui/provider";
import { NavbarProvider } from "./contexts/toggleNavbarContext";
import { NavigatorProvider } from "./contexts/navigatorContext";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import Login from "./pages/Login";
import { system } from "./global/theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider theme={system}>
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavigatorProvider>
              <NavbarProvider>
                <Routes>
                  <Route path="*" element={<App />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
              </NavbarProvider>
            </NavigatorProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
