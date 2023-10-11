import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import ClerkProviderWithRoutes from "./ClerkProviderWithRoutes";

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}

export default App;
