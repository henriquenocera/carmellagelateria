// Funcionários
const FUNCIONARIO_HENRIQUE = "1";
const FUNCIONARIO_MARINA = "2";
const FUNCIONARIO_NICOLAS = "3";
const FUNCIONARIO_GRASIELLI = "4";
const FUNCIONARIO_STHEFANIE = "5";

let funcionario_nome = document.querySelector("#funcionario_nome");

const form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = document.querySelector("#personal_id").value;
  let name_id = document.querySelector("#funcionario_nome");

  switch (id) {
    case "1":
      console.log("Henrique");
      name_id.innerHTML = "Henrique";
      break;
    case "2":
      console.log("Marina");
      name_id.innerHTML = "Marina";
      break;
    case "3":
      console.log("Nciolas");
      name_id.innerHTML = "Nicolas";
      break;
    case "4":
      console.log("Grasielli");
      name_id.innerHTML = "Grasielli";
      break;
    case "5":
      console.log("Sthefanie");
      name_id.innerHTML = "Sthefanie";
      break;
    default:
      console.log("ID Incorreto!");
      name_id.innerHTML = "ID Incorreto!";
  }
});
