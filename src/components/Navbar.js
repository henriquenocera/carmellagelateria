import React, { useState, useEffect } from "react";
import * as Icons from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth/AuthContext";

const navItems = [
  { to: "/", icon: Icons.BsEscape, label: "Manual dos Produtos" },
  { to: "/regras", icon: Icons.BsJournalCheck, label: "Regras da Loja" },
  // { to: "/regulamento-interno", icon: Icons.BsFileEarmarkText, label: "Regulamento Interno" },
  // { to: "/manual", icon: Icons.BsJournalBookmarkFill, label: "Manual" },
  //{ to: "/vales", icon: Icons.BsEmojiSmile, label: "Vales" },
  //{ to: "/checklist-abertura", icon: Icons.BsArrowBarRight, label: "Checklist Abertura" },
  //{ to: "/checklist-fechamento", icon: Icons.BsArrowBarLeft, label: "Checklist Fechamento" },
  //{ to: "/voucher", icon: Icons.BsTicket, label: "Voucher" },
];

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeSidebar();
    };
    if (sidebarOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSidebarOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="nav-bar">
        <button
          type="button"
          className="nav-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={sidebarOpen}
        >
          <Icons.BsList />
        </button>
        <span className="nav-bar-title">Carmella Gelateria</span>
        <div className="nav-user">
          <span className="nav-user-icon">
            <Icons.BsPersonCircle />
          </span>
          <span className="nav-user-email">
            {user?.email || user?.user_metadata?.name || "Usuário"}
          </span>
        </div>
      </header>

      <div
        className={`nav-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
        role="presentation"
      />

      <aside className={`nav-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="nav-sidebar-header">
          <h2>Menu</h2>
        </div>
        <ul className="nav-sidebar-list">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? "active" : "")}
                end={to === "/"}
              >
                <span className="nav-icon">
                  <Icon />
                </span>
                <span className="nav-text">{label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="nav-logout-button"
              onClick={handleSignOut}
            >
              <span className="nav-icon">
                <Icons.BsBoxArrowRight />
              </span>
              <span className="nav-text">Sair</span>
            </button>
          </li>
        </ul>
      </aside>

      <div className="nav-spacer" />
    </>
  );
}

export default NavBar;
