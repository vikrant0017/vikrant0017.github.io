// Generate line numbers dynamically
function generateLineNumbers() {
  const lineNumbers = document.getElementById("lineNumbers");
  const content = document.querySelector(".content");

  if (!lineNumbers || !content) return;

  // Count approximate lines based on content height
  const contentHeight = content.offsetHeight;
  const lineHeight = parseFloat(getComputedStyle(document.body).lineHeight);
  const numberOfLines = Math.ceil(contentHeight / lineHeight);

  // Generate line numbers
  let lineNumbersHTML = "";
  for (let i = 1; i <= numberOfLines; i++) {
    lineNumbersHTML += `${i}<br>`;
  }

  lineNumbers.innerHTML = lineNumbersHTML;
}

// Terminal Contact Form Logic
let currentStep = 0;
let formData = {
  name: "",
  email: "",
  message: "",
};

const steps = [
  {
    prompt: "enter your name:",
    field: "name",
    validate: (value) => value.trim().length > 0,
    errorMsg: "error: name cannot be empty",
  },
  {
    prompt: "enter your email:",
    field: "email",
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMsg: "error: invalid email format",
  },
  {
    prompt: "enter your message:",
    field: "message",
    validate: (value) => value.trim().length > 0,
    errorMsg: "error: message cannot be empty",
  },
];

function initTerminal() {
  const output = document.getElementById("terminalOutput");
  const input = document.getElementById("terminalInput");

  // Initial greeting
  addTerminalLine("=== contact form ===", "terminal-info");
  addTerminalLine("press ctrl+c to reset", "terminal-info");
  addTerminalLine("");

  // Start first prompt
  showPrompt();

  // Handle input
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInput(input.value);
      input.value = "";
    }

    // Handle Ctrl+C to reset
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      resetTerminal();
    }
  });

  // Keep focus on input
  document.addEventListener("click", () => {
    input.focus();
  });
}

function showPrompt() {
  if (currentStep < steps.length) {
    addTerminalLine(`$ ${steps[currentStep].prompt}`, "terminal-prompt-line");
  }
}

function handleInput(value) {
  // Display user input
  addTerminalLine(`  ${value}`, "terminal-user-input");

  if (currentStep >= steps.length) {
    addTerminalLine("error: form already submitted", "terminal-error");
    return;
  }

  const step = steps[currentStep];

  // Validate input
  if (!step.validate(value)) {
    addTerminalLine(step.errorMsg, "terminal-error");
    addTerminalLine("");
    showPrompt();
    return;
  }

  // Store valid input
  formData[step.field] = value;
  addTerminalLine("");

  // Move to next step
  currentStep++;

  if (currentStep < steps.length) {
    showPrompt();
  } else {
    submitForm();
  }
}

function submitForm() {
  addTerminalLine("submitting...", "terminal-info");

  // Simulate submission delay
  setTimeout(() => {
    console.log("Form submitted:", formData);

    addTerminalLine("", "terminal-line");
    addTerminalLine("✓ message sent successfully!", "terminal-success");
    addTerminalLine(`  name: ${formData.name}`, "terminal-info");
    addTerminalLine(`  email: ${formData.email}`, "terminal-info");
    addTerminalLine("", "terminal-line");
    addTerminalLine("thank you for reaching out!", "terminal-success");
    addTerminalLine("press ctrl+c to send another message", "terminal-info");

    // Scroll to bottom
    scrollToBottom();
  }, 500);
}

function resetTerminal() {
  const output = document.getElementById("terminalOutput");
  const input = document.getElementById("terminalInput");

  output.innerHTML = "";
  input.value = "";
  currentStep = 0;
  formData = { name: "", email: "", message: "" };

  addTerminalLine("^C", "terminal-info");
  addTerminalLine("");
  addTerminalLine("=== contact form ===", "terminal-info");
  addTerminalLine("press ctrl+c to reset", "terminal-info");
  addTerminalLine("");

  showPrompt();
  scrollToBottom();
}

function addTerminalLine(text, className = "terminal-line") {
  const output = document.getElementById("terminalOutput");
  const line = document.createElement("div");
  line.className = className;
  line.textContent = text;
  output.appendChild(line);
  scrollToBottom();
}

function scrollToBottom() {
  const terminalBody = document.querySelector(".terminal-body");
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Initialize line numbers on load
window.addEventListener("load", () => {
  generateLineNumbers();
  initTerminal();
});

// Regenerate line numbers on resize
window.addEventListener("resize", generateLineNumbers);
