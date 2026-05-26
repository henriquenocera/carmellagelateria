const targetYear = 2026;
const targetMonth = 6; // June

// Mock profiles with different registrations and off-days
const combinations = [];

const weekdaysList = ["0", "1", "2", "3", "4", "5", "6"];

// Generate different registrations
const registrations = [
  null,
  "2026-06-01",
  "2026-06-02",
  "2026-06-03",
  "2026-06-04",
  "2026-06-05",
  "2026-06-06",
  "2026-06-07",
  "2026-06-08"
];

// We can test single off days
const offDaysOptions = [
  "",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "0,1",
  "0,6"
];

// Frequencia.tsx algorithm
const getLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getDaysArray = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dates = [];
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(new Date(year, month - 1, d));
  }
  return dates;
};

const frequenciaCount = (profile, year, month) => {
  const datesList = getDaysArray(year, month);
  let count = 0;
  const fixedOffDays = profile.folgas_fixas ? profile.folgas_fixas.split(",") : [];
  const regDate = profile.data_registro;

  datesList.forEach((dateObj) => {
    const dateStr = getLocalDateString(dateObj);
    
    // Se a data do dia for anterior à data de admissão, não conta como trabalhado
    if (regDate && dateStr < regDate) {
      return;
    }

    const weekdayVal = String(dateObj.getDay());
    const isFixedOff = fixedOffDays.includes(weekdayVal);
    const defaultStatus = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";

    // Assuming attendance is empty
    const status = defaultStatus;
    const isWorkedStatus = [
      "Trabalhado",
      "Declaração de Horas",
      "Saída Antecipada",
      "Atraso",
      "Registro Formal",
      "Rescisão de Contrato",
      "Outro"
    ].includes(status);

    if (isWorkedStatus) {
      count++;
    }
  });
  return count;
};

// CalculoVales.tsx algorithm
const calculateDefaultWorkdays = (profile, targetMonth, targetYear) => {
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const fixedOffDays = profile.folgas_fixas ? profile.folgas_fixas.split(",") : [];
  const regDateStr = profile.data_registro;

  let workdays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(targetYear, targetMonth - 1, d);
    
    const yStr = dateObj.getFullYear();
    const mStr = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dStr = String(dateObj.getDate()).padStart(2, "0");
    const currentDateStr = `${yStr}-${mStr}-${dStr}`;

    // If date is before registration/hire date, skip
    if (regDateStr && currentDateStr < regDateStr) {
      continue;
    }

    const dayOfWeek = String(dateObj.getDay());
    if (!fixedOffDays.includes(dayOfWeek)) {
      workdays++;
    }
  }
  return workdays;
};

// Run comparisons
let diffCount = 0;
registrations.forEach(reg => {
  offDaysOptions.forEach(off => {
    const profile = {
      data_registro: reg,
      folgas_fixas: off
    };
    const cFreq = frequenciaCount(profile, targetYear, targetMonth);
    const cVales = calculateDefaultWorkdays(profile, targetMonth, targetYear);
    
    if (cFreq !== cVales) {
      console.log(`DIFF found! Reg: ${reg}, Off: "${off}" => Freq: ${cFreq}, Vales: ${cVales}`);
      diffCount++;
    }
  });
});

if (diffCount === 0) {
  console.log("No differences found for any empty-attendance combinations!");
}
