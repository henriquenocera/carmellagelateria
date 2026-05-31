import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route,
  Outlet,
  createRoutesFromElements,
  useLocation,
} from "react-router-dom";
import Home from "./routes/Home.jsx";
import TextosELinks from "./routes/TextosELinks.jsx";
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
import CadastroPessoas from "./routes/CadastroPessoas.tsx";
import Frequencia from "./routes/Frequencia.tsx";
import HistoricoFuncionario from "./routes/HistoricoFuncionario.tsx";
import CalculoVales from "./routes/CalculoVales.tsx";
import Logs from "./routes/Logs.tsx";
import FeriadosGlobais from "./routes/FeriadosGlobais.tsx";
import EstoqueLojas from "./routes/EstoqueLojas.jsx";
import CadastroInsumos from "./routes/CadastroInsumos.tsx";
import ConfiguracaoEstoque from "./routes/ConfiguracaoEstoque.tsx";
import LojaEstoqueInsumos from "./routes/LojaEstoqueInsumos.tsx";
import MovimentacoesEstoque from "./routes/MovimentacoesEstoque.tsx";
import Funcionarios from "./routes/Funcionarios.tsx";
import TesteWhatsApp from "./routes/TesteWhatsApp.tsx";
import ListaCompras from "./routes/ListaCompras.tsx";
import EntradaMercadoria from "./routes/EntradaMercadoria.tsx";
import CadastroProdutos from "./routes/CadastroProdutos.tsx";
import AnaliseInsumos from "./routes/AnaliseInsumos.tsx";
import AnaliseProdutos from "./routes/AnaliseProdutos.tsx";
import supabase from "./supabase-client";

const ProtectedLayout = () => {
  const { session, loading, user } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  React.useEffect(() => {
    // Verifica na API se o usuário ainda existe no banco de dados
    const checkUserValid = async () => {
      if (session) {
        const { data: { user: dbUser }, error } = await supabase.auth.getUser();
        if (error || !dbUser) {
           await supabase.auth.signOut();
           window.location.href = "/login"; // Força o redirecionamento
        }
      }
    };
    checkUserValid();
  }, [location.pathname, session]);

  if (loading) {
    console.log("ProtectedLayout is rendering Carregando... session:", session, "supabaseUrl:", process.env.REACT_APP_SUPABASE_URL);
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
        <Route path="/textos-e-links" element={<TextosELinks />} />
        <Route path="/lojas-checklist" element={<Lojas />} />
        <Route path="/lojas-cubas-estoque" element={<EstoqueLojas />} />
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
        <Route path="/cadastro-pessoas" element={<CadastroPessoas />} />
        <Route path="/cadastro-pessoas/:id" element={<HistoricoFuncionario />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/frequencia" element={<Frequencia />} />
        <Route path="/calculo-vales" element={<CalculoVales />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/feriados-globais" element={<FeriadosGlobais />} />
        <Route path="/cadastro-insumos" element={<CadastroInsumos />} />
        <Route path="/configuracao-estoque" element={<ConfiguracaoEstoque />} />
        <Route path="/loja-estoque-insumos" element={<LojaEstoqueInsumos />} />
        <Route path="/movimentacoes-estoque" element={<MovimentacoesEstoque />} />
        <Route path="/teste-whatsapp" element={<TesteWhatsApp />} />
        <Route path="/lista-compras" element={<ListaCompras />} />
        <Route path="/entrada-mercadoria" element={<EntradaMercadoria />} />
        <Route path="/cadastro-produtos" element={<CadastroProdutos />} />
        <Route path="/analise-insumos" element={<AnaliseInsumos />} />
        <Route path="/analise-produtos" element={<AnaliseProdutos />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
