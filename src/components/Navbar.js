import React, { useState, useEffect } from "react";
import * as Icons from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

const navItems = [
  { to: "/", icon: Icons.BsEscape, label: "Manual dos Produtos" },
  // { to: "/manual", icon: Icons.BsJournalBookmarkFill, label: "Manual" },
  //{ to: "/vales", icon: Icons.BsEmojiSmile, label: "Vales" },
  //{ to: "/checklist-abertura", icon: Icons.BsArrowBarRight, label: "Checklist Abertura" },
  //{ to: "/checklist-fechamento", icon: Icons.BsArrowBarLeft, label: "Checklist Fechamento" },
  //{ to: "/voucher", icon: Icons.BsTicket, label: "Voucher" },
];

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        </ul>
      </aside>

      <div className="nav-spacer" />
    </>
  );
}

export default NavBar;
