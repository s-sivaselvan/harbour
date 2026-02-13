import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Ships from "./pages/Ships";
import Berths from "./pages/Berths";
import Cargo from "./pages/Cargo";
import Bills from "./pages/Bills";

function App() {
  return (
    <>
      {/* Navbar visible on all protected pages */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ships"
          element={
            <ProtectedRoute>
              <Ships />
            </ProtectedRoute>
          }
        />

        <Route
          path="/berths"
          element={
            <ProtectedRoute>
              <Berths />
            </ProtectedRoute>
          }
        />

         <Route
          path="/cargo"
          element={
            <ProtectedRoute>
              <Cargo/>
            </ProtectedRoute>
          }
          />

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}

export default App;
