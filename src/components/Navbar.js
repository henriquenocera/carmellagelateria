import React, { useState } from "react";
import * as Icons from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth/AuthContext";

const navItems = [
  { to: "/", icon: Icons.BsHouseDoor, label: "Início" },
  { to: "/regras", icon: Icons.BsJournalCheck, label: "Regras da Loja" },
];

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <Icons.BsList />
      </button>

      <div 
        className={`nav-overlay ${sidebarOpen ? "open" : ""}`} 
        onClick={() => setSidebarOpen(false)}
        role="presentation"
      ></div>

      <div className={`navigation ${sidebarOpen ? "open" : ""}`}>
        <div 
          className="menuToggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
        ></div>
        <div className="menu-container">
          <ul className="nav-list">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  end={to === "/"}
                >
                  <span className="icon">
                    <Icon />
                  </span>
                  <span className="text">
                    <span className="text-container"><span>{label}</span></span>
                  </span>
                </NavLink>
              </li>
            ))}
            
            <li className="nav-item">
              <button
                type="button"
                className="nav-link logout-btn"
                onClick={handleSignOut}
              >
                <span className="icon">
                  <Icons.BsBoxArrowRight />
                </span>
                <span className="text">
                  <span className="text-container"><span>Sair</span></span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default NavBar;
