import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import ReceiveBlood from "./pages/ReceiveBlood";
import IssueBlood from "./pages/IssueBlood";
import Transactions from "./pages/Transactions";
import UpdatePrice from "./pages/UpdatePrice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProtectedRoute, AdminRoute } from "./components/AuthRoutes";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Protected Routes (Requires Auth) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="receive" element={<ReceiveBlood />} />
          <Route path="issue" element={<IssueBlood />} />
          <Route path="transactions" element={<Transactions />} />
          
          {/* Admin Only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="update-price" element={<UpdatePrice />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;