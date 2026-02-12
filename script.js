// Supabase Configuration
const SUPABASE_URL = "https://nqdvekbcpzrxalyztnjg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZHZla2JjcHpyeGFseXp0bmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTUyMjIsImV4cCI6MjA4NTYzMTIyMn0.W30xUJamhMVUPSU_YB6_kbpU0nZS35YhPI0Nx1-0yxM";

// Job rates (€/hour)
const JOB_RATES = {
  Ganztag: 15,
  Hausaufgabenbetreuung: 15.5,
  Freitagsbetreuung: 15.5,
};

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);

  // Re-render chart with new theme colors
  if (
    trendChart &&
    document.getElementById("dashboardView").classList.contains("active")
  ) {
    const filterValue = document.getElementById("dashboardJobFilter").value;
    const currentMonthEntries = getCurrentMonthEntries(filterValue);
    renderTrendChart(currentMonthEntries);
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

// Supabase client (initialized after DOM load)
let db = null;

// Data storage
let entries = [];
let trendChart = null;
let currentMonthYear = null; // Track current month detail view

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize theme
  initTheme();

  // Initialize Supabase
  try {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase initialized");
  } catch (error) {
    console.error("Failed to initialize Supabase:", error);
    alert("Fehler beim Initialisieren von Supabase");
    return;
  }

  await loadEntries();
  showDashboard();

  // Set today's date as default
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("dateInput");
  if (dateInput) {
    dateInput.value = today;
  }
});

// Load entries from Supabase
async function loadEntries() {
  try {
    const { data, error } = await db
      .from("arbeitszeit_entries")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    entries = data || [];
  } catch (error) {
    console.error("Error loading entries:", error);
    alert("Fehler beim Laden der Daten: " + error.message);
  }
}

// Navigation
function showDashboard() {
  setActiveView("dashboardView");
  document.getElementById("dashboardJobFilter").value = ""; // Reset filter
  renderDashboard();
  closeMenu();
}

function applyDashboardJobFilter() {
  const filterValue = document.getElementById("dashboardJobFilter").value;
  renderDashboard(filterValue);
}

function showAddPage() {
  setActiveView("addView");
  // Set today's date
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dateInput").value = today;
  closeMenu();
}

function showMonthsPage() {
  setActiveView("monthsView");
  renderMonthsList();
  closeMenu();
}

function showMonthDetail(year, month) {
  currentMonthYear = { year, month };
  document.getElementById("jobFilter").value = ""; // Reset filter
  setActiveView("monthDetailView");
  renderMonthDetail(year, month);
}

function applyJobFilter() {
  if (currentMonthYear) {
    const filterValue = document.getElementById("jobFilter").value;
    renderMonthDetail(
      currentMonthYear.year,
      currentMonthYear.month,
      filterValue,
    );
  }
}

function showRemovePage() {
  setActiveView("removeView");
  renderRemoveList();
  closeMenu();
}

function setActiveView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("active");
  });
  document.getElementById(viewId).classList.add("active");
}

// Toggle dropdown menu
function toggleMenu() {
  const dropdown = document.getElementById("menuDropdown");
  const arrow = document.getElementById("menuArrow");
  dropdown.classList.toggle("show");
  arrow.classList.toggle("open");
}

function closeMenu() {
  const dropdown = document.getElementById("menuDropdown");
  const arrow = document.getElementById("menuArrow");
  dropdown.classList.remove("show");
  arrow.classList.remove("open");
}

// Close dropdown when clicking outside
window.onclick = function (event) {
  if (
    !event.target.matches(".menu-btn") &&
    !event.target.matches("#menuArrow")
  ) {
    closeMenu();
  }
};

// Add hours
async function addHours() {
  const jobType = document.getElementById("jobType").value;
  const hours = parseFloat(document.getElementById("hoursInput").value);
  const date = document.getElementById("dateInput").value;

  if (!jobType || isNaN(hours) || hours <= 0 || !date) {
    alert("Bitte wähle eine Stelle, gib die Stunden und das Datum ein!");
    return;
  }

  const rate = JOB_RATES[jobType];
  const total = hours * rate;

  try {
    const { data, error } = await db
      .from("arbeitszeit_entries")
      .insert([
        {
          job: jobType,
          hours: hours,
          rate: rate,
          total: total,
          date: date,
        },
      ])
      .select();

    if (error) throw error;

    // Clear form
    document.getElementById("jobType").value = "";
    document.getElementById("hoursInput").value = "";

    // Reload entries and go to dashboard
    await loadEntries();
    showDashboard();
  } catch (error) {
    console.error("Error adding entry:", error);
    alert("Fehler beim Hinzufügen: " + error.message);
  }
}

// Get current month entries
function getCurrentMonthEntries(jobFilter = "") {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let filtered = entries.filter((entry) => {
    const date = new Date(entry.date);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
    );
  });

  if (jobFilter) {
    filtered = filtered.filter((entry) => entry.job === jobFilter);
  }

  return filtered;
}

// Render dashboard
function renderDashboard(jobFilter = "") {
  // Update title with current month
  const now = new Date();
  const monthName = now.toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
  document.getElementById("dashboardTitle").textContent = monthName;

  const currentMonthEntries = getCurrentMonthEntries(jobFilter);

  renderTrendChart(currentMonthEntries);

  const tbody = document.getElementById("jobTableBody");
  tbody.innerHTML = "";

  if (currentMonthEntries.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: #888; padding: 2rem;">
                    Noch keine Einträge für diesen Monat. Füge über "Optionen" → "Hinzufügen" Stunden hinzu.
                </td>
            </tr>
        `;
    document.getElementById("totalAmount").textContent = "0€";
    return;
  }

  // Group entries by job type and sum hours
  const grouped = {};
  currentMonthEntries.forEach((entry) => {
    if (!grouped[entry.job]) {
      grouped[entry.job] = {
        job: entry.job,
        hours: 0,
        rate: entry.rate,
        total: 0,
      };
    }
    grouped[entry.job].hours += parseFloat(entry.hours);
    grouped[entry.job].total += parseFloat(entry.total);
  });

  // Convert to array and render
  const groupedArray = Object.values(grouped);
  groupedArray.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td style="font-weight: 600;">${index + 1}</td>
            <td>${entry.job}</td>
            <td>${entry.hours}</td>
            <td>${Math.round(entry.total)}€</td>
        `;
    tbody.appendChild(row);
  });

  calculateTotal(currentMonthEntries);
}

// Render Trend Chart
function renderTrendChart(filteredEntries = null) {
  const canvas = document.getElementById("trendChart");
  if (!canvas) return;

  const entriesToUse = filteredEntries !== null ? filteredEntries : entries;

  // Get theme colors
  const isDark =
    document.documentElement.getAttribute("data-theme") !== "light";
  const textColor = isDark ? "#e8e8e8" : "#1a1a1a";
  const gridColor = isDark ? "#1a1a1a" : "#e0e0e0";
  const accentColor = isDark ? "#00ff00" : "#00aa00";

  // Group entries by day and calculate totals
  const dailyData = {};
  entriesToUse.forEach((entry) => {
    const date = new Date(entry.date).toISOString().split("T")[0];

    if (!dailyData[date]) {
      dailyData[date] = {
        hours: 0,
        money: 0,
      };
    }
    dailyData[date].hours += parseFloat(entry.hours);
    dailyData[date].money += parseFloat(entry.total);
  });

  // Sort by date and prepare data
  const sortedDays = Object.keys(dailyData).sort();
  const labels = sortedDays.map((date) =>
    new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
    }),
  );
  const hoursData = sortedDays.map((date) => dailyData[date].hours);
  const moneyData = sortedDays.map((date) => Math.round(dailyData[date].money));

  // Destroy old chart if exists
  if (trendChart) {
    trendChart.destroy();
  }

  // Create new chart
  trendChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Stunden",
          data: hoursData,
          borderColor: accentColor,
          backgroundColor: accentColor + "20",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: "Geld (€)",
          data: moneyData,
          borderColor: accentColor + "aa",
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: textColor,
            font: {
              size: 12,
              weight: "600",
            },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: gridColor,
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.parsed.y;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            display: false,
          },
        },
        y: {
          ticks: {
            stepSize: 1,
            color: textColor,
            font: {
              size: 11,
            },
          },
        },
      },
    },
  });
}

// Calculate total
function calculateTotal(filteredEntries = null) {
  const entriesToUse = filteredEntries !== null ? filteredEntries : entries;
  const total = entriesToUse.reduce(
    (sum, entry) => sum + parseFloat(entry.total),
    0,
  );
  document.getElementById("totalAmount").textContent = `${Math.round(total)}€`;
}

// Render months list
function renderMonthsList() {
  const monthsList = document.getElementById("monthsList");
  monthsList.innerHTML = "";

  if (entries.length === 0) {
    monthsList.innerHTML = `
            <div class="empty-state">
                Noch keine Einträge vorhanden.
            </div>
        `;
    return;
  }

  // Group entries by month
  const monthsData = {};
  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const key = `${year}-${month}`;

    if (!monthsData[key]) {
      monthsData[key] = {
        year: year,
        month: month,
        entries: [],
        totalHours: 0,
        totalMoney: 0,
      };
    }

    monthsData[key].entries.push(entry);
    monthsData[key].totalHours += parseFloat(entry.hours);
    monthsData[key].totalMoney += parseFloat(entry.total);
  });

  // Sort by date (newest first)
  const sortedMonths = Object.values(monthsData).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  // Render month cards
  sortedMonths.forEach((monthData) => {
    const monthName = new Date(
      monthData.year,
      monthData.month,
    ).toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });

    const card = document.createElement("div");
    card.className = "month-card";
    card.onclick = () => showMonthDetail(monthData.year, monthData.month);
    card.innerHTML = `
            <div class="month-card-title">${monthName}</div>
            <div class="month-card-stats">
                <span>${monthData.entries.length} Einträge</span>
                <span>${monthData.totalHours} Stunden</span>
            </div>
            <div class="month-card-total">${Math.round(monthData.totalMoney)}€</div>
        `;
    monthsList.appendChild(card);
  });
}

// Render month detail
function renderMonthDetail(year, month, jobFilter = "") {
  const monthName = new Date(year, month).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
  document.getElementById("monthDetailTitle").textContent = monthName;

  // Filter entries for this month
  let monthEntries = entries.filter((entry) => {
    const date = new Date(entry.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  // Apply job filter if selected
  if (jobFilter) {
    monthEntries = monthEntries.filter((entry) => entry.job === jobFilter);
  }

  // Sort by date (newest first)
  monthEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

  const tbody = document.getElementById("monthDetailTableBody");
  tbody.innerHTML = "";

  monthEntries.forEach((entry) => {
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Get German weekday abbreviation
    const weekday = date.toLocaleDateString("de-DE", { weekday: "short" });

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${dateStr}</td>
            <td>${weekday}</td>
            <td>${entry.job}</td>
            <td>${entry.hours}</td>
            <td>${Math.round(entry.total)}€</td>
        `;
    tbody.appendChild(row);
  });

  // Calculate month total
  const monthTotal = monthEntries.reduce(
    (sum, entry) => sum + parseFloat(entry.total),
    0,
  );
  document.getElementById("monthDetailTotal").textContent =
    `${Math.round(monthTotal)}€`;
}

// Render remove list
function renderRemoveList() {
  const removeList = document.getElementById("removeList");
  removeList.innerHTML = "";

  if (entries.length === 0) {
    removeList.innerHTML = `
            <div class="empty-state">
                Keine Einträge vorhanden.
            </div>
        `;
    return;
  }

  // Sort by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  sortedEntries.forEach((entry) => {
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const item = document.createElement("div");
    item.className = "remove-item";
    item.innerHTML = `
            <div class="remove-item-info">
                <div class="remove-item-title">${entry.job} • ${dateStr}</div>
                <div class="remove-item-details">${entry.hours} Stunden • ${Math.round(entry.total)}€</div>
            </div>
            <button class="delete-btn" onclick="removeEntry(${entry.id})">Löschen</button>
        `;
    removeList.appendChild(item);
  });
}

// Remove entry
async function removeEntry(id) {
  try {
    const { error } = await db
      .from("arbeitszeit_entries")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await loadEntries();
    renderRemoveList();
  } catch (error) {
    console.error("Error removing entry:", error);
    alert("Fehler beim Löschen: " + error.message);
  }
}

// Allow Enter key to submit
document.addEventListener("keypress", (e) => {
  if (
    e.key === "Enter" &&
    document.getElementById("addView").classList.contains("active")
  ) {
    addHours();
  }
});
