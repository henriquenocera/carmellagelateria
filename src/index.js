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
import Perdas from "./routes/Perdas.tsx";
import Vales from "./routes/Vales.tsx";
import Produtos from "./routes/Produtos/Index.tsx";

import Estoque from "./routes/Estoque.tsx";
import Inventario from "./routes/Inventario.tsx";

const AppLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/estoque" element={<Estoque />} />
      <Route path="/vales" element={<Vales />} />
      <Route path="/produtos" element={<Produtos />} />

      <Route path="/perdas" element={<Perdas />} />
      <Route path="/checklist-abertura" element={<ChecklistAbertura />} />
      <Route path="/checklist-fechamento" element={<ChecklistFechamento />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
