import React, { useState } from "react";
import * as Icons from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";
import { useAuth } from "../AuthProvider";

function NavBar() {
  const [sidebar, setSidebar] = useState(false);
  // const [menuActive, setMenuActive] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const { isAdmin } = useAuth();
  let activeMenu = false;

  return (
    <>
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
            <NavLink to="/lojas">
              <span className="icon">
                <Icons.BsAppIndicator />
              </span>
              <span className="text">Lojas</span>
            </NavLink>
          </li>
          {/*          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/status">
              <span className="icon">
                <Icons.BsCheckCircle />
              </span>
              <span className="text">Status</span>
            </NavLink>
          </li> */}
          {/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/vales">
              <span className="icon">
                <Icons.BsEmojiSmile />
              </span>
              <span className="text">Vales</span>
            </NavLink>
          </li> */}

          {/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/inventario">
              <span className="icon">
                <Icons.BsArrowCounterclockwise />
              </span>
              <span className="text">Inventário</span>
            </NavLink>
          </li> */}

          {/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/checklist-abertura">
              <span className="icon">
                <Icons.BsArrowBarRight />
              </span>

              <span className="text">
                Checklist <br></br> Abertura
              </span>
            </NavLink>
          </li> */}
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/checklist-fechamento">
              <span className="icon">
                <Icons.BsArrowBarRight />
              </span>
              <span className="text">Checklist Fechamento</span>
            </NavLink>
          </li>
          {/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/informacoes">
              <span className="icon">
                <Icons.BsCheck />
              </span>
              <span className="text">Informacoes</span>
            </NavLink>
          </li> */}
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/etiquetas">
              <span className="icon">
                <Icons.BsPrinter />
              </span>
              <span className="text">Etiquetas</span>
            </NavLink>
          </li>
          {/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/voucher">
              <span className="icon">
                <Icons.BsTicket />
              </span>
              <span className="text">Voucher</span>
            </NavLink>
          </li> */}

          {/*           <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/crm">
              <span className="icon">
                <Icons.BsPeople />
              </span>
              <span className="text">CRM</span>
            </NavLink>
          </li> */}
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/frequencia">
              <span className="icon">
                <Icons.BsCalendarCheck />
              </span>
              <span className="text">Frequência</span>
            </NavLink>
          </li>
          {isAdmin && (
            <>
              <li className={activeMenu ? "list active" : "list"}>
                <NavLink to="/cadastro-pessoas">
                  <span className="icon">
                    <Icons.BsPeople />
                  </span>
                  <span className="text">Pessoas</span>
                </NavLink>
              </li>
              <li className={activeMenu ? "list active" : "list"}>
                <NavLink to="/calculo-vales">
                  <span className="icon">
                    <Icons.BsCalculator />
                  </span>
                  <span className="text">Cálculo de Vales</span>
                </NavLink>
              </li>
              <li className={activeMenu ? "list active" : "list"}>
                <NavLink to="/logs">
                  <span className="icon">
                    <Icons.BsListCheck />
                  </span>
                  <span className="text">Logs</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default NavBar;
