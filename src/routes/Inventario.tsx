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
  oreo,
  alhoporo,
  loraine,
  caprese,
  aguasgas,
  aguacgas,
  coca,
  cocazero
) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Inventário - Loja ${unidadeText} %0D%0A ${openDateFormat}
  
  %0D%0A Pão de Batata - Catupiry: ${catupiry}
  %0D%0A Pão de Batata - Frango c/ Req: ${frangocreq}
  %0D%0A Pão de Batata - Linguiça: ${linguica}
  %0D%0A Pão de Batata - Pizza: ${pizza}
  %0D%0A Sanduíche - Parma: ${parma}
  %0D%0A Sanduíche - Carne: ${carne}
  %0D%0A Sanduíche - Frango: ${frango}
  %0D%0A Sanduíche - Pernil: ${pernil}
  %0D%0A Sanduíche - Mortadela: ${mortadela}
  %0D%0A Quiche - Alho Poró: ${alhoporo}
  %0D%0A Quiche - Loraine: ${loraine}
  %0D%0A Quiche - Caprese: ${caprese}
  %0D%0A Água s/ Gás: ${aguasgas}
  %0D%0A Água c/ Gás: ${aguacgas}
  %0D%0A Coca: ${coca}
  %0D%0A Coca Zero: ${cocazero}
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
  oreo,
  alhoporo,
  loraine,
  caprese,
  aguasgas,
  aguacgas,
  coca,
  cocazero
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
    oreo,
    alhoporo,
    loraine,
    caprese,
    aguasgas,
    aguacgas,
    coca,
    cocazero
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
  const [pernil, setPernil] = useState("");
  const [mortadela, setMortadela] = useState("");
  const [alhoporo, setAlhoporo] = useState("");
  const [loraine, setLoraine] = useState("");
  const [caprese, setCaprese] = useState("");
  const [aguasgas, setAguasgas] = useState("");
  const [aguacgas, setAguacgas] = useState("");
  const [coca, setCoca] = useState("");
  const [cocazero, setCocazero] = useState("");
  const [confete, setConfete] = useState("0");
  const [pacoca, setPacoca] = useState("0");
  const [oreo, setOreo] = useState("0");

  return (
    <>
      <div className="InvContainer">
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
              oreo,
              alhoporo,
              loraine,
              caprese,
              aguasgas,
              aguacgas,
              coca,
              cocazero
            )
          }
          className="InvContainerForm"
          action=""
        >
          <h2 className="title">Pão de Batata</h2>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Pão de Batata <b>Catupiry:</b>
            </label>
            <input
              onChange={(event) => setCatupiry(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="catupiry"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Pão de Batata <b>Frango c/ Requeijão:</b>
            </label>
            <input
              onChange={(event) => setFrangocreq(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="frangocreq"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Pão de Batata <b>Linguiça Blumenau:</b>
            </label>
            <input
              onChange={(event) => setLinguica(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="linguica"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Pão de Batata <b>Pizza:</b>
            </label>
            <input
              onChange={(event) => setPizza(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="pizza"
              min="0"
              id="90"
            />
          </div>
          <h2 className="title">Sanduiches</h2>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Sanduíche de <b>Parma</b>
            </label>
            <input
              onChange={(event) => setParma(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="parma"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Sanduíche de <b>Carne</b>
            </label>
            <input
              onChange={(event) => setCarne(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="carne"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Sanduíche de <b>Frango</b>
            </label>
            <input
              onChange={(event) => setFrango(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="frango"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Sanduíche de <b>Pernil</b>
            </label>
            <input
              onChange={(event) => setPernil(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="panos"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Sanduíche de <b>Mortadela</b>
            </label>
            <input
              onChange={(event) => setMortadela(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="mortadela"
              min="0"
              id="90"
            />
          </div>
          <h2 className="title">Quiches</h2>

          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Quiche de <b>Alho Poró</b>
            </label>
            <input
              onChange={(event) => setAlhoporo(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="alhoporo"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Quiche de <b>Loraine</b>
            </label>
            <input
              onChange={(event) => setLoraine(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="loraine"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <label className="inventoryLabel" htmlFor="">
              Quiche de <b>Caprese</b>
            </label>
            <input
              onChange={(event) => setCaprese(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="caprese"
              min="0"
              id="90"
            />
          </div>
          <h2 className="title">Bebidas</h2>
          <h3>Realizar a contagem de todas as bebidas: Geladeira + Estoque</h3>
          <div className="inventoryFlexbox">
            <img
              className="ImgBebidas"
              width="30px"
              src="aguasgas.png"
              alt=""
            />
            <label className="inventoryLabel" htmlFor="">
              Água <b>sem Gás</b>
            </label>
            <input
              onChange={(event) => setAguasgas(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="aguasgas"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <img
              className="ImgBebidas"
              width="30px"
              src="aguacgas.png"
              alt=""
            />
            <label className="inventoryLabel" htmlFor="">
              Água <b>com Gás</b>
            </label>
            <input
              onChange={(event) => setAguacgas(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="aguacgas"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <img className="ImgBebidas" width="30px" src="coca.png" alt="" />
            <label className="inventoryLabel" htmlFor="">
              Coca Cola <b></b>
            </label>
            <input
              onChange={(event) => setCoca(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="coca"
              min="0"
              id="90"
            />
          </div>
          <div className="inventoryFlexbox">
            <img
              className="ImgBebidas"
              width="30px"
              src="cocazero.png"
              alt=""
            />
            <label className="inventoryLabel" htmlFor="">
              Coca Cola <b>Zero</b>
            </label>
            <input
              onChange={(event) => setCocazero(event.target.value)}
              className="inventoryInput"
              required
              type="number"
              name="cocazero"
              min="0"
              id="90"
            />
          </div>
          <h2 className="title">Toppings Olga</h2>
          <h3>Potes em cima do balcão</h3>
          <div className="containerInv container-3">
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
