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

import Inventario from "./routes/Inventario.tsx";
import ChecklistConferencia from "./routes/ChecklistConferencia.tsx";
import Voucher from "./routes/Voucher.tsx";
import ChecklistTest from "./routes/ChecklistTest.tsx";
import Manual from "./routes/Manual.tsx";
import Salgados from "./routes/Salgados.tsx";
import Afericao from "./routes/Afericao.tsx";

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
      <Route path="/afericao" element={<Afericao />} />
      <Route path="/salgados" element={<Salgados />} />
      <Route path="/manual" element={<Manual />} />
      <Route path="/vales" element={<Vales />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/checklist-abertura" element={<ChecklistAbertura />} />
      <Route path="/checklist-fechamento" element={<ChecklistFechamento />} />
      <Route path="/checklist-conferencia" element={<ChecklistConferencia />} />
      <Route path="/voucher" element={<Voucher />} />
      <Route path="/checklist-test" element={<ChecklistTest />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
