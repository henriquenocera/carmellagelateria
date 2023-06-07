import React, { useState } from "react";
import * as Icons from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

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
            <NavLink to="/vale-gelato">
              <span className="icon">
                <Icons.BsEmojiSmile />
              </span>

              <span className="text">
                Vale <br></br> Gelato
              </span>
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
