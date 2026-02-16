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
import ChecklistConferencia from "./routes/ChecklistConferencia.tsx";
import Voucher from "./routes/Voucher.tsx";
import ChecklistTest from "./routes/ChecklistTest.tsx";
import Manual from "./routes/Manual.tsx";
import Salgados from "./routes/Salgados.tsx";
import { AuthProvider, useAuth } from "./AuthProvider";
import Login from "./routes/Login.jsx";
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
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
