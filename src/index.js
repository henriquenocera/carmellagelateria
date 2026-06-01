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
import ChecklistAbertura from "./routes/ChecklistAbertura.tsx";
import ChecklistFechamento from "./routes/ChecklistFechamento.tsx";
import NavBar from "./components/Navbar";
import Vales from "./routes/Vales.tsx";
import Salgados from "./routes/Salgados.tsx";
import Inventario from "./routes/Inventario.tsx";
import NovoInventario from "./routes/NovoInventario.tsx";
import VisualizarInventario from "./routes/VisualizarInventario.tsx";
import ChecklistConferencia from "./routes/ChecklistConferencia.tsx";
import Voucher from "./routes/Voucher.tsx";
import ChecklistTest from "./routes/ChecklistTest.tsx";
import Afericao from "./routes/Afericao.tsx";

import { AuthProvider } from "./components/AuthProvider.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Login from "./routes/Login.tsx";

const AppLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vales" element={<Vales />} />
          <Route path="/afericao" element={<Afericao />} /> 
          <Route path="/salgados" element={<Salgados />} /> 
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/inventario/novo" element={<NovoInventario />} />
          <Route path="/inventario/visualizar" element={<VisualizarInventario />} />
          <Route path="/checklist-abertura" element={<ChecklistAbertura />} />
          <Route path="/checklist-fechamento" element={<ChecklistFechamento />} />
          <Route path="/checklist-conferencia" element={<ChecklistConferencia />} />
          <Route path="/voucher" element={<Voucher />} />
          <Route path="/checklist-test" element={<ChecklistTest />} />
        </Route>
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
