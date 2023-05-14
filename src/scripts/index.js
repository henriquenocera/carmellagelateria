// Personal ID's
const FUNCIONARIO_HENRIQUE = 1;
const FUNCIONARIO_MARINA = 2;
let funcionario_nome = document.querySelector("#funcionario_nome");

const form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = document.querySelector("#personal_id");

  if (id.value == FUNCIONARIO_HENRIQUE) {
    funcionario_nome.innerHTML = "Henrique";
  }
});
