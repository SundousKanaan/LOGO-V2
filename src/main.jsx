import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "./components/ui/provider";
import { NavbarProvider } from "./contexts/useToggleNavbar";
import App from "./App";
import Login from "./pages/Login";
import { system } from "./global/theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider theme={system}>
    <React.StrictMode>
      <BrowserRouter>
        <NavbarProvider>
          <Routes>
            <Route path="*" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </NavbarProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
