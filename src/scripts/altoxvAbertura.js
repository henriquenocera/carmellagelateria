const telegramBotId = "5635956016:AAFzevSjVPEhTVsOEfLpbUsT0jni93pG6-c";
const telegramChatId = "-1001602173856";

let form = document.querySelector("#altoxvOpen");
let inputs = document.querySelectorAll(".inp-cbx");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  altoxvOpenSubmit();
});
async function sendOpenMessage(openDateFormat) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist de Abertura - Loja Alto XV %0D%0A  ${openDateFormat}`;
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
    location.reload();
  } catch (error) {
    console.error(error);
    window.alert(
      "Erro na confirmação do Checklist, por gentileza tente novamente"
    );
  }
}

function getLocalStorage() {
  let today = new Date();
  let open = JSON.parse(localStorage.getItem("altoxvOpen"));
  if (open) {
    open.timestamp = open.timestamp;
    console.log(open.timestamp);
  } else {
    open = "Ainda nao completo";
  }
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

function altoxvOpenSubmit() {
  const currentDate = new Date();
  console.log(currentDate);

  var object = { value: "complete", timestamp: new Date().getTime() };
  localStorage.setItem("altoxvOpen", JSON.stringify(object));

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
  sendOpenMessage(openDateFormat);

  let loader = document.querySelector(".lds-roller");
  loader.classList.add("active");

  let container = document.querySelector("#altoxvOpen");
  container.innerHTML = "";
}

let aviso = document.querySelector("info-diaria");
let avisotext = document.querySelector(".aviso-diario");
let diaSemana = document.querySelector("#dia-da-semana");

var date = new Date();
date.setDate(date.getDate() + 1);

let weekDay = new Date().toLocaleDateString("Pt-BR", { weekday: "long" });
console.log(weekDay);

diaSemana.innerHTML += weekDay;
let domingo = "";
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
} else if (weekDay == "sábado") {
  avisotext.innerHTML = sabado;
}
