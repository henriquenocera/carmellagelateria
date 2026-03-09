import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./routes/Home";
import Regras from "./routes/Regras";
import RegulamentoInterno from "./routes/RegulamentoInterno";
import NavBar from "./components/Navbar";
import Login from "./routes/Login";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <NavBar />}
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/regras" element={<Regras />} />
        <Route path="/regulamento-interno" element={<RegulamentoInterno />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
