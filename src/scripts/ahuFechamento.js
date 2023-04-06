const telegramBotId = "5635956016:AAFzevSjVPEhTVsOEfLpbUsT0jni93pG6-c";
const telegramChatId = "-1001602173856";

let form = document.querySelector("#ahuOpen");
let inputs = document.querySelectorAll(".inp-cbx");
let massas = document.querySelector('input[name="massas"]');
let morango = document.querySelector('input[name="morango"]');
let banana = document.querySelector('input[name="banana"]');

form.addEventListener("submit", (e) => {
  e.preventDefault();

  ahuCloseSubmit();
});

function getLocalStorage() {
  let today = new Date();
  let open = JSON.parse(localStorage.getItem("ahuClose"));
  open.timestamp = open.timestamp;
  console.log(open.timestamp);
  let openDateFormat = new Date(open.timestamp);
  openDateFormat =
    "Checklist Completo em: " +
    openDateFormat.getDate() +
    "/" +
    openDateFormat.getMonth() +
    "/" +
    openDateFormat.getFullYear() +
    " -- " +
    openDateFormat.getHours() +
    ":" +
    openDateFormat.getMinutes() +
    ":" +
    openDateFormat.getSeconds();
  console.log(openDateFormat);

  let e = document.querySelector("#timestamp");
  e.innerHTML += openDateFormat;

  let dayToday = today.getDate();
  let lastDayComplete = new Date(open.timestamp).getDate();

  if (dayToday == lastDayComplete) {
    console.log("Stop Form");
    // Checklist already complete today
    // Block Form
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    let inputs = form.querySelectorAll(".inp-cbx");
    inputs.forEach((input) => {
      input.checked = true;
      input.disabled = true;
    });

    let button = form.querySelector(".submit");
    button.disabled = true;
  } else {
    let e = document.querySelector("#timestamp");
    e.innerHTML = "";
  }
}
getLocalStorage();

function ahuCloseSubmit() {
  const currentDate = new Date();
  console.log(currentDate);

  var object = { value: "complete", timestamp: new Date().getTime() };
  localStorage.setItem("ahuClose", JSON.stringify(object));

  let openDateFormat = new Date(object.timestamp);
  openDateFormat =
    openDateFormat.getDate() +
    "/" +
    openDateFormat.getMonth() +
    "/" +
    openDateFormat.getFullYear() +
    " -- " +
    openDateFormat.getHours() +
    ":" +
    openDateFormat.getMinutes() +
    ":" +
    openDateFormat.getSeconds();
  sendCloseMessage(openDateFormat);

  let loader = document.querySelector(".lds-roller");
  loader.classList.add("active");

  let container = document.querySelector("#ahuOpen");
  container.innerHTML = "";
  let aviso = document.querySelector(".info-diaria");
  aviso.innerHTML = "";

  setTimeout(() => {
    location.reload();
  }, 3500);
}

function sendCloseMessage(openDateFormat) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist de Fechamento - Loja Ahú %0D%0A  ${openDateFormat} %0D%0A nº de massas congeladas: ${massas.value} %0D%0A Potes Fechados de Morango: ${morango.value} %0D%0A Potes Fechados de Banana: ${banana.value}`;
  fetch(checkOpenComplete, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: "oi" }),
  })
    .then((response) => response.json())
    .then((response) => console.log(response));
}

let aviso = document.querySelector("info-diaria");
let avisotext = document.querySelector(".aviso-diario");
let diaSemana = document.querySelector("#dia-da-semana");

var date = new Date();
date.setDate(date.getDate() + 1);

let weekDay = new Date().toLocaleDateString("Pt-BR", { weekday: "long" });
console.log(weekDay);

diaSemana.innerHTML += weekDay;
let domingo =
  "Não colocar os lixos para fora. O caminhão do lixo não passa hoje";
let segunda = "";
let terca = "";
let quarta = "";
let quinta = "";
let sexta = "";
let sabado = "";

if (weekDay == "domingo") {
  avisotext.innerHTML = domingo;
} else if (weekDay == "segunda-feira") {
  avisotext.innerHTML = segunda;
} else if (weekDay == "terca-feira") {
  avisotext.innerHTML = terca;
} else if (weekDay == "quarta-feira") {
  avisotext.innerHTML = quarta;
} else if (weekDay == "quinta-feira") {
  avisotext.innerHTML = quinta;
} else if (weekDay == "sexta-feira") {
  avisotext.innerHTML = sexta;
} else if (weekDay == "sabado") {
  avisotext.innerHTML = sabado;
}
