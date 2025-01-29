import React, { useState } from "react";
import * as Icons from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

function NavBar() {
  const [sidebar, setSidebar] = useState(false);
  // const [menuActive, setMenuActive] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  let activeMenu = false;

  return (
    <>
      <div className={sidebar ? "navigation open" : "navigation"}>
        <div className="menuToggle" onClick={showSidebar}></div>
        <ul>
          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/vales">
              <span className="icon">
                <Icons.BsEmojiSmile />
              </span>
              <span className="text">Vales</span>
            </NavLink>
          </li>

          <li className={activeMenu ? "list active" : "list"}>
            <NavLink to="/inventario">
              <span className="icon">
                <Icons.BsArrowCounterclockwise />
              </span>
              <span className="text">Inventário</span>
            </NavLink>
          </li>

          <li className={activeMenu ? "list active" : "list"}>
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
          </li>
        </ul>
      </div>
    </>
  );
}

export default NavBar;
