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

import ChecklistEscritorio from "./routes/ChecklistEscritorio.tsx";
import NavBar from "./components/Navbar";
import Inventario from "./routes/Inventario.tsx";

import Lojas from "./routes/Lojas.tsx";
import MapaFoodService from "./routes/MapaFoodService.tsx";
import CRM from "./routes/CRM.tsx";
import HistoricoCliente from "./routes/HistoricoCliente.tsx";

import Etiquetas from "./routes/Etiquetas.tsx";
import NotificacoesLoja from "./routes/NotificacoesLoja.tsx";
import { AuthProvider, useAuth } from "./AuthProvider";
import Login from "./routes/Login.jsx";

import CadastroPessoas from "./routes/configuracoes/CadastroPessoas.tsx";
import Frequencia from "./routes/Frequencia.tsx";
import HistoricoFuncionario from "./routes/HistoricoFuncionario.tsx";
import CalculoVales from "./routes/CalculoVales.tsx";
import Logs from "./routes/configuracoes/Logs.tsx";
import FeriadosGlobais from "./routes/configuracoes/FeriadosGlobais.tsx";
import EstoqueLojas from "./routes/EstoqueLojas.jsx";
import CadastroInsumos from "./routes/configuracoes/CadastroInsumos.tsx";
import AnaliseVales from "./routes/AnaliseVales.tsx";
import ConfiguracaoEstoque from "./routes/configuracoes/ConfiguracaoEstoque.tsx";
import LojaEstoqueInsumos from "./routes/LojaEstoqueInsumos.tsx";
import MovimentacoesEstoque from "./routes/MovimentacoesEstoque.tsx";
import Funcionarios from "./routes/Funcionarios.tsx";
import HistoricoVT_VR from "./routes/HistoricoVT_VR.tsx";

import ListaCompras from "./routes/ListaCompras.tsx";
import ListaComprasManual from "./routes/ListaComprasManual.tsx";
import EntradaMercadoria from "./routes/EntradaMercadoria.tsx";
import CadastroProdutos from "./routes/configuracoes/CadastroProdutos.tsx";
import AnaliseInsumos from "./routes/AnaliseInsumos.tsx";
import AnaliseProdutos from "./routes/AnaliseProdutos.tsx";
import ProducaoRealizada from "./routes/ProducaoRealizada.tsx";
import EstoqueFabrica from "./routes/EstoqueFabrica.tsx";
import OrdemProducao from "./routes/OrdemProducao.tsx";
import CadastroFornecedores from "./routes/configuracoes/CadastroFornecedores.tsx";
import CadastroClientes from "./routes/configuracoes/CadastroClientes.tsx";
import ProdutosVale from "./routes/configuracoes/ProdutosVale.tsx";
import supabase from "./services/supabase-client";

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
        <Route path="/mapa-food-service" element={<MapaFoodService />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/crm/cliente/:id" element={<HistoricoCliente />} />
        <Route path="/notificacoes-loja" element={<NotificacoesLoja />} />
        <Route path="/lojas-cubas-estoque" element={<EstoqueLojas />} />

        <Route path="/inventario" element={<Inventario />} />

        <Route path="/checklist-escritorio" element={<ChecklistEscritorio />} />

        <Route path="/etiquetas" element={<Etiquetas />} />

        <Route path="/configuracoes/cadastro-pessoas" element={<CadastroPessoas />} />
        <Route path="/configuracoes/cadastro-pessoas/:id" element={<HistoricoFuncionario />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/historico-vt-vr" element={<HistoricoVT_VR />} />
        <Route path="/frequencia" element={<Frequencia />} />
        <Route path="/calculo-vales" element={<CalculoVales />} />
        <Route path="/configuracoes/logs" element={<Logs />} />
        <Route path="/configuracoes/feriados-globais" element={<FeriadosGlobais />} />
        <Route path="/configuracoes/cadastro-insumos" element={<CadastroInsumos />} />
        <Route path="/configuracoes/configuracao-estoque" element={<ConfiguracaoEstoque />} />
        <Route path="/loja-estoque-insumos" element={<LojaEstoqueInsumos />} />
        <Route path="/movimentacoes-estoque" element={<MovimentacoesEstoque />} />

        <Route path="/lista-compras" element={<ListaCompras />} />
        <Route path="/lista-compras-manual" element={<ListaComprasManual />} />
        <Route path="/entrada-mercadoria" element={<EntradaMercadoria />} />
        <Route path="/configuracoes/cadastro-produtos" element={<CadastroProdutos />} />
        <Route path="/analise-insumos" element={<AnaliseInsumos />} />
        <Route path="/analise-produtos" element={<AnaliseProdutos />} />
        <Route path="/producao-realizada" element={<ProducaoRealizada />} />
        <Route path="/estoque-fabrica" element={<EstoqueFabrica />} />
        <Route path="/analise-vales" element={<AnaliseVales />} />
        <Route path="/ordem-producao" element={<OrdemProducao />} />
        <Route path="/configuracoes/cadastro-fornecedores" element={<CadastroFornecedores />} />
        <Route path="/configuracoes/cadastro-clientes" element={<CadastroClientes />} />
        <Route path="/configuracoes/produtos-vale" element={<ProdutosVale />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
