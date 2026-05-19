import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
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
import Informacoes from "./routes/Informacoes.tsx";
import Voucher from "./routes/Voucher.tsx";
import ChecklistTest from "./routes/ChecklistTest.tsx";
import Lojas from "./routes/Lojas.tsx";
import Manual from "./routes/Manual.tsx";
import Etiquetas from "./routes/Etiquetas.tsx";
import { AuthProvider, useAuth } from "./AuthProvider";
import Login from "./routes/Login.jsx";
import CRM from "./routes/CRM.jsx";
import Status from "./routes/Status.tsx";
import supabase from "./supabase-client";

const ProtectedLayout = () => {
  const { session, loading, user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {user && (
        <div className="topbar-user-info">
          <span className="topbar-user-info__email">
            {user.email || user.user_metadata?.full_name || "Usuário"}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="topbar-user-info__button"
          >
            Sair
          </button>
        </div>
      )}
      <NavBar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/lojas" element={<Lojas />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/vales" element={<Vales />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/checklist-abertura" element={<ChecklistAbertura />} />
        <Route path="/checklist-fechamento" element={<ChecklistFechamento />} />
        <Route path="/informacoes" element={<Informacoes />} />
        <Route path="/voucher" element={<Voucher />} />
        <Route path="/etiquetas" element={<Etiquetas />} />
        <Route path="/checklist-test" element={<ChecklistTest />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/status" element={<Status />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
