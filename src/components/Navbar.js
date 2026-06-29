import React, { useState, useEffect, useRef } from "react";
import * as Icons from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import "../css/Navbar.css";
import { useAuth } from "../AuthProvider";

const MENU_CONFIG = [
  {
    title: "Início",
    icon: <Icons.BsHouseDoor />,
    path: "/",
  },
  {
    title: "Checklists",
    icon: <Icons.BsCardChecklist />,
    id: "checklists",
    subItems: [
      { title: "Checklist Escritório", path: "/checklist-escritorio" }
    ]
  },
  {
    title: "Operações",
    icon: <Icons.BsBriefcase />,
    id: "operacoes",
    subItems: [
      { title: "Notificações Loja", path: "/notificacoes-loja", adminOnly: true },
      { title: "Textos e Links", path: "/textos-e-links" },
      { title: "Etiquetas", path: "/etiquetas" },
      { title: "Checklists", path: "/lojas-checklist" },
    ]
  },
  {
    title: "Comercial",
    icon: <Icons.BsShop />,
    id: "comercial",
    subItems: [
      { title: "Mapa Food Service", path: "/mapa-food-service" },
      { title: "CRM", path: "/crm" },
      { title: "Pedidos Food Service", path: "/pedidos-food-service" },
    ]
  },
  {
    title: "Produção",
    icon: <Icons.BsClipboardData />,
    id: "producao",
    subItems: [
      { title: "Ordem de Produção", path: "/ordem-producao", adminOnly: true },
      { title: "Produção Realizada", path: "/producao-realizada" },
      { title: "Estoque Fábrica", path: "/estoque-fabrica" }
    ]
  },
  {
    title: "Estoque",
    icon: <Icons.BsBoxSeam />,
    id: "estoque",
    subItems: [
      { title: "Estoque Cubas", path: "/lojas-cubas-estoque" },
      { title: "Estoque Insumos", path: "/loja-estoque-insumos" },
      { title: "Movimentações", path: "/movimentacoes-estoque" },
      { title: "Inventário", path: "/inventario" },
    ]
  },
  {
    title: "Compras",
    icon: <Icons.BsCart3 />,
    id: "compras",
    subItems: [
      { title: "Lista de Compras", subtitle: "Automático", subtitleColor: "#3b82f6", path: "/lista-compras" },
      { title: "Lista de Compras", subtitle: "Manual", subtitleColor: "#f59e0b", path: "/lista-compras-manual" },
      { title: "Entrada de Mercadoria", path: "/entrada-mercadoria" },
    ]
  },
  {
    title: "Análise",
    icon: <Icons.BsGraphUp />,
    id: "analise",
    subItems: [
      { title: "Análise de Vales", path: "/analise-vales", adminOnly: true },
      { title: "Análise de Insumos", path: "/analise-insumos" },
      { title: "Análise de Produtos", path: "/analise-produtos" },
    ]
  },
  {
    title: "Financeiro",
    icon: <Icons.BsCurrencyDollar />,
    id: "financeiro",
    subItems: [
      { title: "Dashboard Financeiro", path: "/dashboard-financeiro", adminOnly: true },
      { title: "Caixa Dinheiro", path: "/caixa-dinheiro", adminOnly: true },
      { title: "Contas fixas", path: "/contas-fixas", adminOnly: true },
      { title: "Lançamentos Financeiros", path: "/lancamentos-financeiros" },
      { title: "Conciliação bancária", path: "/conciliacao-bancaria" },
      { title: "Importe de Extrato", path: "/importe-extrato" },
      { title: "Importe Vendas Rede", path: "/importe-vendas-rede" },
      { title: "Contas à pagar e receber", path: "/contas-pagar-receber" },
    ]
  },
  {
    title: "RH",
    icon: <Icons.BsPerson />,
    id: "rh",
    subItems: [
      { title: "Cálculo de Vales", path: "/calculo-vales", adminOnly: true },
      { title: "Histórico de Vales", subtitle: "VT / VR", subtitleColor: "#10b981", path: "/historico-vt-vr", adminOnly: true },
      { title: "Funcionários", path: "/funcionarios" },
      { title: "Frequência", path: "/frequencia" },
    ]
  },
  {
    title: "Configurações",
    icon: <Icons.BsGear />,
    id: "admin",
    adminOnly: true,
    subItems: [
      { title: "Cadastro Pessoas", path: "/configuracoes/cadastro-pessoas" },
      { title: "Cadastro Feriados", path: "/configuracoes/feriados-globais" },
      { title: "Cadastro de Fornecedores", path: "/configuracoes/cadastro-fornecedores" },
      { title: "Cadastro de Contas", path: "/configuracoes/cadastro-contas" },
      { title: "Categorias Financeiras", path: "/configuracoes/categorias-financeiras" },
      { title: "Clientes Food Service", path: "/configuracoes/cadastro-clientes" },
      { title: "Cadastro de Insumos", path: "/configuracoes/cadastro-insumos" },
      { title: "Cadastro de Produtos", path: "/configuracoes/cadastro-produtos" },
      { title: "Cadastro Produtos Vale", path: "/configuracoes/produtos-vale" },
      { title: "Cadastro de Voucher", path: "/configuracoes/cadastro-vouchers" },
      { title: "Configuração de Estoque", path: "/configuracoes/configuracao-estoque" },
      { title: "Logs", path: "/configuracoes/logs" },
    ]
  }
];

function NavBar() {
  const [sidebar, setSidebar] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navRef = useRef(null);

  const toggleSidebar = () => setSidebar(!sidebar);

  const toggleMenu = (menuId) => {
    if (!sidebar) {
      setSidebar(true);
      setOpenMenus({ [menuId]: true });
    } else {
      setOpenMenus((prev) => ({
        ...prev,
        [menuId]: !prev[menuId]
      }));
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const newOpenMenus = { ...openMenus };
    let changed = false;

    MENU_CONFIG.forEach(item => {
      if (item.subItems) {
        const isActive = item.subItems.some(sub => currentPath === sub.path || currentPath.startsWith(sub.path + "/"));
        if (isActive && !openMenus[item.id]) {
          newOpenMenus[item.id] = true;
          changed = true;
        }
      }
    });

    if (changed) {
      setOpenMenus(newOpenMenus);
    }

    // Auto-close sidebar on page change
    setSidebar(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Handle click outside to close sidebar
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setSidebar(false);
      }
    }

    if (sidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebar]);

  return (
    <div ref={navRef} className={sidebar ? "navigation open" : "navigation"}>
      <div className="menuToggle" onClick={toggleSidebar}></div>
      <div className="menu-container">
        <ul className="nav-list">
          {MENU_CONFIG.map((item, index) => {
            if (item.adminOnly && !isAdmin) return null;

            const isItemAdminOnly = item.adminOnly;

            if (item.path) {
              return (
                <li key={index} className="nav-item">
                  <NavLink to={item.path} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <span className="icon">{item.icon}</span>
                    <span className="text">
                      <span className="text-container">
                        <span>{item.title}</span>
                        {isItemAdminOnly && <span className="admin-badge-sub">Admin</span>}
                      </span>
                    </span>
                  </NavLink>
                </li>
              );
            }

            const isOpen = openMenus[item.id];
            const isChildActive = item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + "/"));
            const visibleSubItems = [
              ...item.subItems.filter(sub => sub.adminOnly && isAdmin),
              ...item.subItems.filter(sub => !sub.adminOnly)
            ];

            const submenuHeight = visibleSubItems.reduce((acc, sub) => {
              const hasBadge = sub.adminOnly || isItemAdminOnly;
              let height = sub.subtitle ? 70 : 55;
              if (hasBadge) height += 10;
              return acc + height;
            }, 30);

            return (
              <li key={index} className={`nav-item accordion ${isOpen ? 'open' : ''} ${isChildActive ? 'child-active' : ''}`}>
                <div className="nav-link accordion-header" onClick={() => toggleMenu(item.id)}>
                  <span className="icon">{item.icon}</span>
                  <span className="text">
                    <span className="text-container">
                      <span>{item.title}</span>
                      {isItemAdminOnly && <span className="admin-badge-sub">Admin</span>}
                    </span>
                  </span>
                  <span className="chevron-icon">
                    {isOpen ? <Icons.BsChevronUp /> : <Icons.BsChevronDown />}
                  </span>
                </div>

                <div className="submenu-wrapper" style={{ height: isOpen && sidebar ? `${submenuHeight}px` : '0px' }}>
                  <ul className="submenu">
                    {visibleSubItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="submenu-item">
                        <NavLink to={subItem.path} className={({ isActive }) => isActive ? "submenu-link active" : "submenu-link"}>
                          <span className="submenu-indicator"></span>
                          <span className="text">
                            <span className="text-container" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                              <span>{subItem.title}</span>
                              {subItem.subtitle && (
                                <span style={{
                                  fontSize: "0.85rem",
                                  color: subItem.subtitleColor || "#94a3b8",
                                  fontWeight: "700",
                                  lineHeight: 1,
                                  letterSpacing: "0.5px"
                                }}>
                                  {subItem.subtitle.toUpperCase()}
                                </span>
                              )}
                              {(subItem.adminOnly || isItemAdminOnly) && <span className="admin-badge-sub">Admin</span>}
                            </span>
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
