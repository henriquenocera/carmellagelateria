import React, { useEffect, useRef, useState } from "react";
import "../css/Valegelato.css";

function ValeGelato() {
  return (
    <>
      <div className="valegelatoContainer">
        <form
          method="POST"
          action="https://script.google.com/macros/s/AKfycbxDrWqp2krWjcqXa0e6kXiKQI5jMqgDj2BZ9lJYsQxKnp_OtRld1YhA6s4A0rA0FbE42A/exec"
        >
          <input name="Name" type="text" placeholder="Name" required />
          <input name="Email" type="email" placeholder="Email" required />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default ValeGelato;
