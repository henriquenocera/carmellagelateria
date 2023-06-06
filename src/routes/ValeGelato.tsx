import React, { useRef } from "react";
import "../css/Valegelato.css";

function ValeGelato() {
  const formRef = useRef(null);
  const scriptUrl =
    "https://script.google.com/macros/s/AKfycbx4dWb5hrwyYD_FnMlh57Xovl4wM8VAFVh3gS6h1vzUFCnaeAFPyYw0fhUaPN9dQVuAeg/exec";
  const api =
    "AKfycbx4dWb5hrwyYD_FnMlh57Xovl4wM8VAFVh3gS6h1vzUFCnaeAFPyYw0fhUaPN9dQVuAeg";

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(scriptUrl, { method: "POST", body: new FormData(formRef.current) })
      .then((res) => {
        console.log("SUCCESSFULLY SUBMITTED");
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="valegelatoContainer">
        <h1>Vale Gelato</h1>

        <form
          onSubmit={handleSubmit}
          method="post"
          ref={formRef}
          name="google-sheet"
        >
          <div className="form-style">
            <input type="" name="name" placeholder="Your Name *" />
          </div>
          <div className="form-style">
            <input type="email" name="email" placeholder="Your Email *" />
          </div>
          <div className="form-style">
            <input type="number" name="phone" placeholder="Your Phone *" />
          </div>
          <div className="form-style">
            <input type="submit" name="submit" value="Login" />
          </div>
        </form>
      </div>
    </>
  );
}

export default ValeGelato;
