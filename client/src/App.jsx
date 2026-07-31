import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import ReceiveBlood from "./pages/ReceiveBlood";
import IssueBlood from "./pages/IssueBlood";
import Transactions from "./pages/Transactions";
import UpdatePrice from "./pages/UpdatePrice";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="receive" element={<ReceiveBlood />} />
        <Route path="issue" element={<IssueBlood />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="update-price" element={<UpdatePrice />} />
      </Route>
    </Routes>
  );
}

export default App;