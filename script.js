const display = document.getElementById("display");
let currentInput = "";
let resultDisplayed = false;

// Update the display with formatted numbers
function updateDisplay(val) {
  const raw = val !== undefined ? val : currentInput || "0";

  if (raw === "Error") {
    display.textContent = "Error";
    return;
  }

  if (/[\+\-\*\/]$/.test(raw)) {
    display.textContent = raw;
    return;
  }

  try {
    const parts = raw.split(/([\+\-\*\/])/);
    display.textContent = parts
      .map((part) => {
        if (["+", "-", "*", "/"].includes(part)) return ` ${part} `;
        if (isNaN(part)) return part;
        const number = parseFloat(part);
        return isFinite(number)
          ? number.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : part;
      })
      .join("");
  } catch {
    display.textContent = raw;
  }
}

// Handle button clicks
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    handleInput(btn.dataset.value, btn.dataset.action);
  });
});

// Keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (!isNaN(key) || ["+", "-", "*", "/", "."].includes(key)) {
    handleInput(key);
  }
  if (key === "Enter" || key === "=") {
    handleInput(null, "calculate");
  }
  if (key === "Backspace") {
    handleInput(null, "delete");
  }
  if (key.toLowerCase() === "c") {
    handleInput(null, "clear");
  }
});

function handleInput(value, action) {
  if (value) {
    if (currentInput.replace(/[\+\-\*\/]/g, "").length >= 25) return;
    if (resultDisplayed) {
      currentInput = "";
      resultDisplayed = false;
    }
    currentInput += value;
    updateDisplay();
  }

  if (action === "clear") {
    currentInput = "";
    updateDisplay("0");
  }

  if (action === "delete") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  }

  if (action === "calculate") {
    try {
      currentInput = eval(currentInput).toString();
      resultDisplayed = true;
      updateDisplay();
    } catch {
      updateDisplay("Error");
      currentInput = "";
    }
  }
}

// Theme toggle
const themeBtn = document.getElementById("toggle-theme");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.setAttribute("data-theme", "dark");
  themeBtn.textContent = "☀️";
} else {
  themeBtn.textContent = "🌓";
}

themeBtn.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "🌓";
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "☀️";
  }
});
