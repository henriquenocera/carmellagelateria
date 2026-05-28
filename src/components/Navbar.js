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
    title: "Operações",
    icon: <Icons.BsBriefcase />,
    id: "operacoes",
    subItems: [
      { title: "Lojas - Checklists", path: "/lojas-checklist" },
      { title: "Lojas - Cubas", path: "/lojas-cubas-estoque" },
      { title: "Textos e Links", path: "/textos-e-links" },
      { title: "Etiquetas", path: "/etiquetas" },
    ]
  },
  {
    title: "RH",
    icon: <Icons.BsPerson />,
    id: "rh",
    subItems: [
      { title: "Frequência", path: "/frequencia" },
      { title: "Cálculo de Vales", path: "/calculo-vales", adminOnly: true },
    ]
  },
  {
    title: "Checklists",
    icon: <Icons.BsCardChecklist />,
    id: "checklists",
    subItems: [
      { title: "Checklist", path: "/checklist-fechamento" }
    ]
  },
  {
    title: "Configurações",
    icon: <Icons.BsGear />,
    id: "admin",
    adminOnly: true,
    subItems: [
      { title: "Cadastro Pessoas", path: "/cadastro-pessoas" },
      { title: "Cadastro Feriados", path: "/feriados-globais" },
      { title: "Logs", path: "/logs" },
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
            const visibleSubItems = item.subItems.filter(sub => !sub.adminOnly || isAdmin);

            const submenuHeight = visibleSubItems.reduce((acc, sub) => {
              const hasBadge = sub.adminOnly || isItemAdminOnly;
              if (hasBadge) {
                return acc + (sub.title.length > 12 ? 70 : 58);
              }
              return acc + 48;
            }, 20);

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
                            <span className="text-container">
                              <span>{subItem.title}</span>
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
