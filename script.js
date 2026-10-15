const WEEKS_IN_YEAR = 52;

const DEFAULTS = {
  employees: "25",
  hours: "4.5",
  hourlyRate: "2500",
};

const form = document.getElementById("calc-form");
const employeesInput = document.getElementById("employees");
const hoursInput = document.getElementById("hours");
const hourlyRateInput = document.getElementById("hourlyRate");
const errorEl = document.getElementById("form-error");
const resetBtn = document.getElementById("reset-btn");
const resultsEl = document.getElementById("results");
const resultsEmptyEl = document.getElementById("results-empty");
const weeklyLossEl = document.getElementById("weekly-loss");
const yearlyLossEl = document.getElementById("yearly-loss");
const weeklyBarEl = document.getElementById("weekly-bar");
const yearlyBarEl = document.getElementById("yearly-bar");
const weeklyBarValueEl = document.getElementById("weekly-bar-value");
const yearlyBarValueEl = document.getElementById("yearly-bar-value");

function applyDefaults() {
  employeesInput.value = DEFAULTS.employees;
  hoursInput.value = DEFAULTS.hours;
  hourlyRateInput.value = DEFAULTS.hourlyRate;
}

function hideError() {
  errorEl.hidden = true;
  errorEl.textContent = "";
}

function showError(message) {
  errorEl.hidden = false;
  errorEl.textContent = message;
}

function hideResults() {
  resultsEl.hidden = true;
  resultsEmptyEl.hidden = false;
}

function formatTenge(value) {
  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(value);
}

function parsePositiveNumber(raw, fieldName) {
  const normalized = String(raw).trim().replace(",", ".");

  if (normalized === "") {
    throw new Error(`Заполните поле «${fieldName}».`);
  }

  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    throw new Error(`Поле «${fieldName}» должно содержать число.`);
  }

  if (value <= 0) {
    throw new Error(`Поле «${fieldName}» должно быть больше нуля.`);
  }

  return value;
}

function calculateLosses(employees, hours, hourlyRate) {
  const weekly = employees * hours * hourlyRate;
  const yearly = weekly * WEEKS_IN_YEAR;
  return { weekly, yearly };
}

function renderResults(weekly, yearly) {
  weeklyLossEl.textContent = formatTenge(weekly);
  yearlyLossEl.textContent = formatTenge(yearly);
  weeklyBarValueEl.textContent = formatTenge(weekly);
  yearlyBarValueEl.textContent = formatTenge(yearly);

  const max = Math.max(weekly, yearly, 1);
  weeklyBarEl.style.width = `${(weekly / max) * 100}%`;
  yearlyBarEl.style.width = `${(yearly / max) * 100}%`;

  resultsEmptyEl.hidden = true;
  resultsEl.hidden = false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideError();

  try {
    const employees = parsePositiveNumber(employeesInput.value, "Количество сотрудников");
    const hours = parsePositiveNumber(
      hoursInput.value,
      "Средние часы потерянного времени на одного сотрудника в неделю"
    );
    const hourlyRate = parsePositiveNumber(
      hourlyRateInput.value,
      "Стоимость одного рабочего часа, ₸"
    );

    const { weekly, yearly } = calculateLosses(employees, hours, hourlyRate);
    renderResults(weekly, yearly);
  } catch (error) {
    hideResults();
    showError(error.message);
  }
});

resetBtn.addEventListener("click", () => {
  hideError();
  hideResults();
  applyDefaults();
  employeesInput.focus();
});

applyDefaults();
