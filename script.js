const RESERVATION_STORAGE_KEY = "bella-napoli-reservations-v1";

const tables = [
  { id: 1, seats: 2 },
  { id: 2, seats: 2 },
  { id: 3, seats: 2 },
  { id: 4, seats: 2 },
  { id: 5, seats: 4 },
  { id: 6, seats: 4 },
  { id: 7, seats: 4 },
  { id: 8, seats: 4 },
  { id: 9, seats: 4 },
  { id: 10, seats: 4 },
  { id: 11, seats: 6 },
  { id: 12, seats: 6 },
  { id: 13, seats: 6 },
  { id: 14, seats: 6 },
  { id: 15, seats: 2 },
  { id: 16, seats: 2 },
  { id: 17, seats: 4 },
  { id: 18, seats: 4 },
  { id: 19, seats: 6 },
  { id: 20, seats: 6 }
];

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");
const yearElement = document.getElementById("year");
const reservationForm = document.getElementById("reservationForm");
const guestNameInput = document.getElementById("guestName");
const guestEmailInput = document.getElementById("guestEmail");
const guestCountInput = document.getElementById("guestCount");
const reservationDateInput = document.getElementById("reservationDate");
const reservationTimeInput = document.getElementById("reservationTime");
const reserveButton = document.getElementById("reserveButton");
const reservationMessage = document.getElementById("reservationMessage");
const reservationResult = document.getElementById("reservationResult");

let reservations = [];

function setYear() {
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

function setupMenu() {
  if (!menuButton || !mainNav) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

function loadReservations() {
  try {
    const raw = localStorage.getItem(RESERVATION_STORAGE_KEY);
    if (!raw) {
      reservations = [];
      return;
    }

    const parsed = JSON.parse(raw);
    reservations = Array.isArray(parsed) ? parsed : [];
  } catch {
    reservations = [];
  }
}

function saveReservations() {
  localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservations));
}

function setDefaultDateTime() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  if (reservationDateInput) {
    reservationDateInput.value = today;
    reservationDateInput.min = today;
  }

  if (reservationTimeInput) {
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    const hours = String(Math.min(Math.max(nextHour.getHours(), 11), 23)).padStart(2, "0");
    const minutes = nextHour.getMinutes() >= 30 ? "30" : "00";
    reservationTimeInput.value = `${hours}:${minutes}`;
  }
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function formatTime(timeString) {
  return timeString;
}

function getReservationsForSlot(date, time) {
  return reservations.filter((reservation) => reservation.date === date && reservation.time === time);
}

function isTableFree(tableId, date, time) {
  return !reservations.some((reservation) => {
    const assignedTableIds = Array.isArray(reservation.tableIds)
      ? reservation.tableIds
      : [reservation.tableId];

    return assignedTableIds.includes(tableId) && reservation.date === date && reservation.time === time;
  });
}

function findTableCombination(guestCount, date, time) {
  const availableTables = tables
    .filter((table) => isTableFree(table.id, date, time))
    .sort((left, right) => left.seats - right.seats || left.id - right.id);

  let bestCombination = null;

  function search(startIndex, selectedTables, selectedSeats) {
    if (selectedSeats >= guestCount) {
      if (
        !bestCombination
        || selectedSeats < bestCombination.totalSeats
        || (selectedSeats === bestCombination.totalSeats && selectedTables.length < bestCombination.tables.length)
      ) {
        bestCombination = {
          tables: [...selectedTables],
          totalSeats: selectedSeats
        };
      }
      return;
    }

    for (let index = startIndex; index < availableTables.length; index += 1) {
      const nextTable = availableTables[index];
      selectedTables.push(nextTable);
      search(index + 1, selectedTables, selectedSeats + nextTable.seats);
      selectedTables.pop();
    }
  }

  search(0, [], 0);
  return bestCombination;
}

function setMessage(text, type) {
  reservationMessage.textContent = text;
  reservationMessage.className = "reservation-message";

  if (type) {
    reservationMessage.classList.add(type === "error" ? "is-error" : "is-success");
  }
}

function renderReservationResult(reservation) {
  reservationResult.hidden = false;
  reservationResult.innerHTML = `
    <p>Reservierung bestaetigt fuer ${reservation.name}, ${reservation.guestCount} Personen am ${formatDate(reservation.date)} um ${formatTime(reservation.time)}.</p>
  `;
}

function validateReservationData(name, email, guestCount, date, time) {
  if (!name) {
    return "Bitte gib deinen Namen ein.";
  }

  if (!email) {
    return "Bitte gib deine E-Mail-Adresse ein.";
  }

  if (!guestEmailInput.checkValidity()) {
    return "Bitte gib eine gueltige E-Mail-Adresse ein.";
  }

  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
    return "Reservierungen sind fuer 1 bis 20 Personen moeglich.";
  }

  if (!date) {
    return "Bitte waehle ein Datum aus.";
  }

  if (!time) {
    return "Bitte waehle eine Uhrzeit aus.";
  }

  const selectedDateTime = new Date(`${date}T${time}`);
  if (Number.isNaN(selectedDateTime.getTime())) {
    return "Datum oder Uhrzeit sind ungueltig.";
  }

  if (selectedDateTime.getTime() < Date.now() - 60000) {
    return "Bitte waehle eine zukuenftige Reservierungszeit.";
  }

  return "";
}

function handleReservationSubmit(event) {
  event.preventDefault();

  const name = guestNameInput.value.trim();
  const email = guestEmailInput.value.trim();
  const guestCount = Number.parseInt(guestCountInput.value, 10);
  const date = reservationDateInput.value;
  const time = reservationTimeInput.value;

  const validationError = validateReservationData(name, email, guestCount, date, time);
  if (validationError) {
    reservationResult.hidden = true;
    setMessage(validationError, "error");
    return;
  }

  reserveButton.disabled = true;

  const assignedCombination = findTableCombination(guestCount, date, time);
  if (!assignedCombination) {
    reservationResult.hidden = true;
    setMessage("Zu diesem Zeitpunkt ist leider kein passender Tisch mehr frei.", "error");
    reserveButton.disabled = false;
    return;
  }

  const reservation = {
    id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${guestCount}`,
    name,
    email,
    guestCount,
    date,
    time,
    tableIds: assignedCombination.tables.map((table) => table.id),
    seats: assignedCombination.totalSeats,
    createdAt: new Date().toISOString()
  };

  reservations.push(reservation);
  saveReservations();
  setMessage("");
  renderReservationResult(reservation);
  reservationForm.reset();
  setDefaultDateTime();
  reserveButton.disabled = false;
}

setYear();
setupMenu();
loadReservations();
setDefaultDateTime();

reservationForm.addEventListener("submit", handleReservationSubmit);
