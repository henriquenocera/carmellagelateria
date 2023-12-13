import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/bs";
import "../css/Inventario.css";

const telegramBotId = "6170143874:AAGyo6gioXlufhGGzPTGNe9YE6TrCuoKEWU";
const telegramChatId = "-1001602173856";
const unidadeText = "Ahu";
const unidade = "ahu";

async function sendOpenMessage(
  openDateFormat,
  panos,
  catupiry,
  frangocreq,
  linguica,
  pizza,
  parma,
  carne,
  frango,
  pernil,
  mortadela,
  confete,
  pacoca,
  oreo
) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Inventário - Loja ${unidadeText} %0D%0A ${openDateFormat}
  
  %0D%0A Panos Limpos: ${panos} 
  %0D%0A Pão de Batata - Catupiry: ${catupiry}
  %0D%0A Pão de Batata - Frango c/ Req: ${frangocreq}
  %0D%0A Pão de Batata - Linguiça: ${linguica}
  %0D%0A Pão de Batata - Pizza: ${pizza}
  %0D%0A Sanduíche - Parma: ${parma}
  %0D%0A Sanduíche - Carne: ${carne}
  %0D%0A Sanduíche - Frango: ${frango}
  %0D%0A Sanduíche - Pernil: ${pernil}
  %0D%0A Sanduíche - Mortadela: ${mortadela}
  %0D%0A Pote Confete: ${confete}%
  %0D%0A Pote Pacoca: ${pacoca}%
  %0D%0A Pote Oreo: ${oreo}%`;

  try {
    const response = await fetch(checkOpenComplete, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    console.log(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    window.alert(
      "Erro na confirmação do Checklist, por gentileza tente novamente"
    );
  } finally {
    console.log("sucesso");
    window.alert("Lançamento Realizado com Sucesso!");
    window.location.replace(`https://${unidade}.carmellagelateria.com.br/`);
  }
}

function handleSubmit(
  event,
  panos,
  catupiry,
  frangocreq,
  linguica,
  pizza,
  parma,
  carne,
  frango,
  pernil,
  mortadela,
  confete,
  pacoca,
  oreo
) {
  console.log("enviou");
  event.preventDefault();
  var object = { value: "complete", timestamp: new Date().getTime() };
  let openDateFormat = new Date(object.timestamp);
  openDateFormat =
    openDateFormat.getDate() +
    "/" +
    (openDateFormat.getMonth() + 1) +
    "/" +
    openDateFormat.getFullYear() +
    " -- " +
    openDateFormat.getHours() +
    ":" +
    openDateFormat.getMinutes() +
    ":" +
    openDateFormat.getSeconds();
  sendOpenMessage(
    openDateFormat,
    panos,
    catupiry,
    frangocreq,
    linguica,
    pizza,
    parma,
    carne,
    frango,
    pernil,
    mortadela,
    confete,
    pacoca,
    oreo
  );
}

function Inventario() {
  const [isFormSending, setIsFormSending] = useState(false);

  const [panos, setPanos] = useState("");
  const [catupiry, setCatupiry] = useState("");
  const [frangocreq, setFrangocreq] = useState("");
  const [linguica, setLinguica] = useState("");
  const [pizza, setPizza] = useState("");
  const [parma, setParma] = useState("");
  const [carne, setCarne] = useState("");
  const [frango, setFrango] = useState("");
  const [pernil, setPenil] = useState("");
  const [mortadela, setMortadela] = useState("");
  const [confete, setConfete] = useState("0");
  const [pacoca, setPacoca] = useState("0");
  const [oreo, setOreo] = useState("0");

  return (
    <>
      <div className="InventarioContainer">
        <img className="logo" src="/logo.svg" alt="" />
        <h1>Inventário</h1>
        <form
          onSubmit={(event) =>
            handleSubmit(
              event,
              panos,
              catupiry,
              frangocreq,
              linguica,
              pizza,
              parma,
              carne,
              frango,
              pernil,
              mortadela,
              confete,
              pacoca,
              oreo
            )
          }
          className="containerForm"
          action=""
        >
          <div className="container container-1">
            <div className="checkbox-wrapper label-wrapper">
              <label className="label " htmlFor="">
                <b>Panos</b> Limpos
              </label>
              <input
                onChange={(event) => setChocolate(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="freezer"
                min="0"
                id="90"
              />
            </div>
          </div>
          <h2 className="title">Pão de Batata</h2>
          <div className="container container-2">
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Catupiry
              </label>
              <input
                onChange={(event) => setCatupiry(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="morango"
                min="0"
                id="92"
              />
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Frango c/ Requeijão
              </label>
              <input
                onChange={(event) => setFrangocreq(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="banana"
                min="0"
                id="92"
              />
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Linguiça Blumenau
              </label>
              <input
                onChange={(event) => setLinguica(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="amora"
                min="0"
                id="92"
              />
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Pizza
              </label>
              <input
                onChange={(event) => setPizza(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="maca"
                min="0"
                id="92"
              />
            </div>
          </div>
          <h2 className="title">Sanduiches</h2>
          <div className="container container-3">
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Parma
              </label>
              <input
                onChange={(event) => setParma(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="morango"
                min="0"
                id="92"
              />
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Carne
              </label>
              <input
                onChange={(event) => setCarne(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="banana"
                min="0"
                id="92"
              />
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Frango
              </label>
              <input
                onChange={(event) => setFrango(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="amora"
                min="0"
                id="92"
              />
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Pernil
              </label>
              <input
                onChange={(event) => setPenil(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="maca"
                min="0"
                id="92"
              />
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Mortadela
              </label>
              <input
                onChange={(event) => setMortadela(event.target.value)}
                className="inputNumber"
                required
                type="number"
                name="maca"
                min="0"
                id="92"
              />
            </div>
          </div>
          <h2 className="title">Toppings Olga</h2>
          <h3>Potes em cima do balcão</h3>
          <div className="container container-3">
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Confete
              </label>
              <input
                onChange={(event) => setConfete(event.target.value)}
                className="inputRange"
                required
                type="range"
                name="morango"
                min="0"
                max="100"
                step="25"
                value={confete}
                id="92"
              />
              <datalist id="values">
                <option value="100" label="Pote cheio"></option>
                <option value="75" label="Quase Cheio"></option>
                <option value="50" label="Metade"></option>
                <option value="25" label="Quase Vazio"></option>
                <option value="0" label="Pote Vazio"></option>
              </datalist>
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Paçoca
              </label>
              <input
                onChange={(event) => setPacoca(event.target.value)}
                className="inputRange"
                required
                type="range"
                name="morango"
                min="0"
                max="100"
                step="25"
                value={pacoca}
                id="92"
              />
              <datalist id="values">
                <option value="100" label="Pote cheio"></option>
                <option value="75" label="Quase Cheio"></option>
                <option value="50" label="Metade"></option>
                <option value="25" label="Quase Vazio"></option>
                <option value="0" label="Pote Vazio"></option>
              </datalist>
            </div>
            <div className="checkbox-wrapper label-wrapper">
              <label className="label" htmlFor="">
                Oreo
              </label>
              <input
                onChange={(event) => setOreo(event.target.value)}
                className="inputRange"
                required
                type="range"
                name="morango"
                min="0"
                max="100"
                step="25"
                value={oreo}
                id="92"
              />
              <datalist id="values">
                <option value="100" label="Pote cheio"></option>
                <option value="75" label="Quase Cheio"></option>
                <option value="50" label="Metade"></option>
                <option value="25" label="Quase Vazio"></option>
                <option value="0" label="Pote Vazio"></option>
              </datalist>
            </div>
          </div>
          <button className="submit" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}

export default Inventario;
