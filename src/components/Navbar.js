import React, { useState } from "react";
import * as Icons from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthProvider.tsx";
import "../css/Navbar.css";

function NavBar() {
  const [sidebar, setSidebar] = useState(false);
  // const [menuActive, setMenuActive] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  let activeMenu = false;

  const { user } = useAuth();

  return (
    <>
      {user && (
        <div className="user-badge">
          {user.email}
        </div>
      )}
      <div className={sidebar ? "navigation open" : "navigation"}>
        <div className="menuToggle" onClick={showSidebar}></div>
        <ul>
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/">
              <span className="icon">
                <Icons.BsEscape />
              </span>
              <span className="text">Início</span>
            </NavLink>
          </li>
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/tarefas">
              <span className="icon">
                <Icons.BsListCheck />
              </span>
              <span className="text">Tarefas</span>
            </NavLink>
          </li>
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/checklist">
              <span className="icon">
                <Icons.BsCheck2Square />
              </span>
              <span className="text">Checklist</span>
            </NavLink>
          </li>

          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/conferencia-vales-checklist">
              <span className="icon">
                <Icons.BsCardChecklist />
              </span>
              <span className="text">Conferência vales e checklist</span>
            </NavLink>
          </li>
{/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/afericao">
              <span className="icon">
                <Icons.BsEject />
              </span>
              <span className="text">Aferição de Peso</span>
            </NavLink>
          </li> */}
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/salgados">
              <span className="icon">
                <Icons.BsCheck />
              </span>
              <span className="text">Salgados</span>
            </NavLink>
          </li>
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/vales">
              <span className="icon">
                <Icons.BsEmojiSmile />
              </span>
              <span className="text">Vales</span>
            </NavLink>
          </li>

{/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/inventario">
              <span className="icon">
                <Icons.BsArrowCounterclockwise />
              </span>
              <span className="text">Inventário</span>
            </NavLink>
          </li> */}

          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/inventario">
              <span className="icon">
                <Icons.BsBoxSeam />
              </span>
              <span className="text">Inventário Insumos</span>
            </NavLink>
          </li>

{/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/checklist-abertura">
              <span className="icon">
                <Icons.BsArrowBarRight />
              </span>

              <span className="text">
                Checklist <br></br> Abertura
              </span>
            </NavLink>
          </li>
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/checklist-fechamento">
              <span className="icon">
                <Icons.BsArrowBarLeft />
              </span>
              <span className="text">Checklist Fechamento</span>
            </NavLink>
          </li> */}
{/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/checklist-conferencia">
              <span className="icon">
                <Icons.BsCheck />
              </span>
              <span className="text">Checklist De Conferência</span>
            </NavLink>
          </li> */}
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/voucher">
              <span className="icon">
                <Icons.BsTicket />
              </span>
              <span className="text">Voucher</span>
            </NavLink>
          </li>

          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/senhas">
              <span className="icon">
                <Icons.BsShieldLock />
              </span>
              <span className="text">Senhas</span>
            </NavLink>
          </li>

        </ul>
      </div>
    </>
  );
}

export default NavBar;
