import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import ErpPage from "./ErpPage";
import CrmPage from "./CrmPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/erp" element={<ErpPage />} />
        <Route path="/crm" element={<CrmPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
