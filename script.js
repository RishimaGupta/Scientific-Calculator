// Get the display element from the HTML
let display = document.getElementById("display");
// Initialize memory for M+ , M- , MR, MC functions
let memory = 0;
// Set the default angle mode to degrees
let angleMode = "DEG"; // Default

// A flag to indicate if the display is ready for a new input.
// This will be true after a calculation is performed.
let readyForNewInput = false;

// --- Memory Functions ---

// Function to add the current display value to memory
function memoryAdd() {
  // Clear display if ready for new input
  if (readyForNewInput) {
    display.value = "";
    readyForNewInput = false;
  }
  // Parse the display value as a float, default to 0 if invalid
  memory += parseFloat(display.value) || 0;
}

// Function to subtract the current display value from memory
function memorySubtract() {
  // Clear display if ready for new input
  if (readyForNewInput) {
    display.value = "";
    readyForNewInput = false;
  }
  // Parse the display value as a float, default to 0 if invalid
  memory -= parseFloat(display.value) || 0;
}

// Function to recall the value stored in memory and display it
function memoryRecall() {
  display.value = memory;
  readyForNewInput = true; // After recalling, display is ready for new input
}

// Function to clear the memory
function memoryClear() {
  memory = 0;
}

// Function to store the memory
function memoryStore() {
  memory = parseFloat(display.value) || 0;
}

// Function to toggle between Degree and Radian modes for trigonometric calculations
function toggleAngleMode() {
  // If current mode is DEG, change to RAD, otherwise change to DEG
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  // Update the text content of the angle mode indicator on the UI
  document.getElementById("angleMode").textContent = angleMode;
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// --- Evaluate Trigonometric Functions ---

// Function to evaluate trigonometric functions based on the current angle mode
function evaluateTrig(fn, value) {
  // Convert value to radians if angle mode is DEG, otherwise use as is
  const input = angleMode === "DEG" ? toRadians(value) : value;
  // Perform the corresponding trigonometric calculation
  switch (fn) {
    case 'sin':
      return Math.sin(input);
    case 'cos':
      return Math.cos(input);
    case 'tan':
      return Math.tan(input);
  }
}

// Function to apply a trigonometric function to the current display value
function applyTrig(fn) {
  try {
    // Get the expression from the display with automatic paranthesis closed 
    const expression = autoCloseParentheses(display.value);
    // Evaluate the numeric value of the expression
    const val = eval(expression);
    // Convert the value to radians if angle mode is DEG, otherwise use as is
    const input = angleMode === "DEG" ? toRadians(val) : val;

    // Handle undefined tangent cases (90 + n*180 in degrees, or pi/2 + n*pi in radians)
    if (fn === "tan") {
      if (angleMode === "DEG") {
        // Tangent is undefined at odd multiples of 90°
        if (Math.abs((val % 180) - 90) < 1e-6) {
          throw new Error("tan is undefined at " + val + "°");
        }
      } else {
        // Tangent is undefined at odd multiples of π/2
        const mod = input % Math.PI;
        if (Math.abs(mod - Math.PI / 2) < 1e-6 || Math.abs(mod + Math.PI / 2) < 1e-6) {
          throw new Error("tan is undefined at " + val + " rad");
        }
      }
    }

    let result;
    // Perform the specified trigonometric calculation
    switch (fn) {
      case 'sin':
        result = Math.sin(input);
        break;
      case 'cos':
        result = Math.cos(input);
        break;
      case 'tan':
        result = Math.tan(input);
        break;
      default:
        throw new Error("Unknown function");
    }

    // Format the result and display it
    display.value = formatResult(result);
    // Add the calculation to the history
    addToHistory(`${fn}(${val}) = ${formatResult(result)}`);
    // Set flag to indicate readiness for new input after a trig function is applied
    readyForNewInput = true;

  } catch (e) {
    // If an error occurs, display "Error" and add to history
    display.value = "Error";
    addToHistory(`${fn}(${display.value}) = Error`);
  }
}

// --- Mathematical Utility Functions ---

// Function for base-10 logarithm
function log10(x) {
  if (x <= 0) throw new Error("Invalid input for log"); // Logarithm is undefined for non-positive numbers
  return Math.log10(x);
}

// Function for natural logarithm
function ln(x) {
  if (x <= 0) throw new Error("Invalid input for ln"); // Logarithm is undefined for non-positive numbers
  return Math.log(x);
}

// Function for square root
function sqrt(x) {
  if (x < 0) throw new Error("Invalid input for sqrt"); // Square root is undefined for negative numbers
  return Math.sqrt(x);
}

// Function to preprocess the expression before evaluation
function preprocessExpression(expr) {
  // Check for tan() values that are undefined before actual evaluation
  const undefinedTanMatch = expr.match(/tan\(([^)]+)\)/);
  if (undefinedTanMatch) {
    const inner = eval(undefinedTanMatch[1]); // Evaluate the inner part of tan()
    // Convert angle to degrees for consistent checking, regardless of mode
    const angle = angleMode === "DEG" ? inner : inner * (180 / Math.PI);

    // Check for undefined tangent at odd multiples of 90 degrees
    if (Math.abs((angle % 180) - 90) < 1e-6) {
      throw new Error("tan is undefined at " + angle + " degrees");
    }
  }

  // Replace trig functions with their Math equivalents, considering angle mode
  if (angleMode === "DEG") {
    // Replace sin(x), cos(x), tan(x) with their radian equivalents
    expr = expr.replace(/sin\(([^)]+)\)/g, (_, arg) => `Math.sin(toRadians(${arg}))`);
    expr = expr.replace(/cos\(([^)]+)\)/g, (_, arg) => `Math.cos(toRadians(${arg}))`);
    expr = expr.replace(/tan\(([^)]+)\)/g, (_, arg) => `Math.tan(toRadians(${arg}))`);
  } else {
    // If in radian mode, directly use Math functions
    expr = expr.replace(/sin\(([^)]+)\)/g, (_, arg) => `Math.sin(${arg})`);
    expr = expr.replace(/cos\(([^)]+)\)/g, (_, arg) => `Math.cos(${arg})`);
    expr = expr.replace(/tan\(([^)]+)\)/g, (_, arg) => `Math.tan(${arg})`);
  }

  // Replace custom function names with their JavaScript equivalents
  expr = expr.replace(/log\(/g, "log10("); // 'log' is replaced with 'log10'
  expr = expr.replace(/ln\(/g, "ln("); // 'ln' is kept as 'ln' (custom function)
  expr = expr.replace(/√/g, "sqrt("); // '√' is replaced with 'sqrt' (custom function)
  return expr;
}

// Factorial function
function factorial(n) {
  if (n < 0) return "error"; // Factorial is not defined for negative numbers
  if (n === 0 || n === 1) return 1; // Base cases for factorial
  return n * factorial(n - 1); // Recursive call for factorial
}

// --- Display Manipulation Functions ---

// Append number or decimal to display
function appendNumber(value) {
  // If ready for new input, clear the display first
  if (readyForNewInput) {
    display.value = "";
    readyForNewInput = false;
  }
  display.value += value;
}

// Append operator to display
function appendOperator(operator) {
  // If ready for new input and the operator is not a starting parenthesis, it means we are starting a new calculation with an operator, so clear display.
  // If it's a parenthesis, it might be part of the previous result.
  if (readyForNewInput && operator !== '(') {
    display.value = "";
    readyForNewInput = false;
  } 
  else if (readyForNewInput && operator === '(') {
      // If we are ready for new input and the user presses '(', it should append to the current display (which might be the result of a previous calculation)
      // or start a new expression if the display was cleared for a new number.
      // We don't want to clear the display if the user is building on the previous result with parentheses.
      readyForNewInput = false; // The next input will build on this.
  }

  if (operator === '√') {
    display.value += "Math.sqrt("; // For square root, append the Math.sqrt function
  } 
  else if (operator === '%') {
    display.value += "/100"; // For percentage, append division by 100
  } 
  else if (operator === '^') {
      display.value += '**'; // Use JavaScript's exponentiation operator
  }
  else {
    display.value += operator; // Append other operators directly
  }
}


// Append scientific function or constant to display
function appendFunction(func) {
  // If ready for new input, clear the display first
  if (readyForNewInput) {
    display.value = "";
    readyForNewInput = false;
  }
  display.value += func;
}

// Clear the entire display
function clearDisplay() {
  display.value = "";
  readyForNewInput = false; // Reset the flag
}

// Clear the last character from the display (backspace functionality)
function clearEntry() {
  // If ready for new input, pressing CE should just clear the display.
  if (readyForNewInput) {
    display.value = "";
    readyForNewInput = false;
  } else {
    display.value = display.value.slice(0, -1); // Remove the last character
  }
  if (display.value === "") {
    display.value = "0"; // If display becomes empty, set it to "0"
  }
}

// Format the result to a fixed number of decimal places and handle near-zero values
function formatResult(result) {
  if (Math.abs(result) < 1e-10) return 0; // Treat very small numbers as 0
  return parseFloat(result.toFixed(8)); // Format to 8 decimal places and convert back to float
}

// Calculate and display the result of the expression
function calculate() {
  try {
    let rawExpr = display.value; // Get the raw expression from display
    rawExpr = autoCloseParentheses(rawExpr); // auto-close bracket )
    let expr = preprocessExpression(rawExpr); // Preprocess the expression
    let result = eval(expr); // Evaluate the expression
    result = formatResult(result); // Format the result
    display.value = result; // Display the result
    addToHistory(rawExpr + " = " + result); // Add the calculation to history
    readyForNewInput = true; // Set the flag to true after calculation
  } catch (e) {
    display.value = "Error"; // Display "Error" if calculation fails
    readyForNewInput = true; // Still set flag to true so next input clears error
  }
}

// Auto closing parantheses
function autoCloseParentheses(expr) {
  const openCount = (expr.match(/\(/g) || []).length; // Count how many opening parentheses "(" are in the expression
  const closeCount = (expr.match(/\)/g) || []).length; // Count how many closing parentheses ")" are in the expression
  const missing = openCount - closeCount; // Calculate how many closing parentheses are missing
  return expr + ')'.repeat(Math.max(0, missing));// If there are missing closing parentheses, add them to the end of the expression
  // Math.max(0, missing) ensures we don't add negative parentheses
}


// Add an entry to the calculation history
function addToHistory(entry) {
  const historyList = document.getElementById("historyList"); // Get the history list element
  const li = document.createElement("li"); // Create a new list item

  // Display the full entry (e.g., "sin(30) = 0.5")
  li.textContent = entry;

  // Extract the left-hand side of the expression for reuse
  const expression = entry.split('=')[0].trim();

  // Make the history entry clickable to reuse the expression
  li.style.cursor = 'pointer'; // Change cursor to pointer to indicate clickability
  li.title = "Click to reuse this calculation"; // Add a tooltip
  li.addEventListener("click", function() {
    display.value = expression; // When clicked, set the display value to the expression
    readyForNewInput = false; // After reusing history, we are not ready for new input (user wants to edit/continue)
  });

  historyList.prepend(li); // Add new entry at the top of the history list
}

// --- Keyboard Input Handling ---

// Add event listener for keyboard input
document.addEventListener("keydown", function(e) {
  const key = e.key;

  if (!isNaN(key) || key === ".") {
    // Handle number and decimal point input
    appendNumber(key);
  } 
  else if (["+", "-", "*", "/", "(", ")", "%", "^"].includes(key)) {
    // Handle standard operators, parentheses, percentage, and exponentiation (using ^ for keyboard)
    appendOperator(key);
  } 
  else if (key === "Enter") {
    // Handle "Enter" key to trigger calculation
    e.preventDefault(); // Prevent default browser behavior (e.g., form submission)
    calculate();
  } 
  else if (key === "Backspace") {
    // Handle "Backspace" key for clear entry
    clearEntry();
  } 
  else if (key.toLowerCase() === 'c') {
    // Handle 'c' or 'C' for clear display (AC)
    clearDisplay();
  }
});