# Scientific-Calculator <br>
## Deployed Website Link <br>
https://rishimagupta.github.io/Scientific-Calculator/ <br>
## Project Overview <br>
This repository contains the source code for a fully functional Scientific Calculator implemented using HTML, CSS, and JavaScript. The project aims to provide a user-friendly and robust calculator application capable of performing basic arithmetic operations, advanced scientific calculations, and memory functions, while adhering to principles of responsive design and comprehensive error handling.<br>
## Features <br>
The calculator offers a comprehensive set of features, categorized as follows: <br>
### Core Functionality <br>
* *Basic Arithmetic Operations:* Supports addition (+), subtraction (-), multiplication (*), and division (/). <br>
* *Order of Operations:* Correctly evaluates expressions following standard mathematical precedence (BODMAS/BIDMAS). <br>
* *User Input Handling:* Responsive to both button clicks on the graphical interface and keyboard input. <br>
* *Error Handling:* Implements mechanisms to gracefully manage mathematical errors, such as division by zero, invalid expressions, and undefined trigonometric results. <br>
### Advanced Scientific Features <br>
* *Trigonometric Functions:* Includes sin, cos, and tan functions. <br>
* *Angle Mode Toggle:* Allows users to switch between Degree (DEG) and Radian (RAD) modes for trigonometric calculations. <br>
* *Logarithmic Functions:* Provides log (base 10) and ln (natural logarithm) functions. <br>
* *Square Root:* Functionality to compute the square root (√). <br>
* *Factorial:* Calculates the factorial of a non-negative integer (x!). <br>
* *Constants:* Buttons for inserting mathematical constants π (Pi) and e (Euler's number). <br>
* *Exponentiation:* Supports power calculations using the ^ operator. <br>
* *Percentage:* Allows for percentage calculations (%). <br>
* *Parentheses:* Enables the use of parentheses () for grouping expressions and controlling order of operations. <br>
### Usability Enhancements <br>
* *Memory Functions:* Includes M+ (memory add), M- (memory subtract), MR (memory recall), MS (memory store) and MC (memory clear). <br>
* *Clear Operations:* Dedicated buttons for AC (All Clear) and CE (Clear Entry/Backspace). <br>
* *Calculation History:* Maintains a log of previous calculations, which can be reviewed and reused by clicking on the entries. <br>
* *Automatic Display Clearing:* The display automatically clears for a new input after a calculation is finalized (upon pressing =). <br>
* *Responsive Design:* The user interface is designed to adapt and display optimally across various screen sizes, from mobile devices to desktop monitors. <br>
## Technologies Used <br>
* *HTML5:* For structuring the content and defining the calculator's layout. <br>
* *CSS3:* For styling the user interface, ensuring visual appeal and responsiveness. <br>
* *JavaScript (ES6+):* For implementing all core calculator logic, input handling, and dynamic UI updates. <br>
## Key Learnings and Development Highlights <br>
* *Robust Error Handling:* Implementation of try-catch blocks and specific validation checks for mathematical operations (e.g., division by zero, logarithms of non-positive numbers, square roots of negative numbers, and undefined tangent values) to ensure stable and informative error messages. <br>
* *Dynamic Input Management:* A custom readyForNewInput flag and handleNewInputState helper function were developed to intelligently manage display clearing. This provides a seamless user experience where the display automatically clears for a new calculation after a result is shown, or allows for continuation of the previous result with operators. <br>
* *Expression Parsing and Evaluation:* The preprocessExpression function was crucial for handling complex expressions, including the conversion of custom function strings (e.g., log(, √) to valid JavaScript Math methods and ensuring proper angle mode conversions for trigonometric functions before eval() execution. Notably, the calculator does not strictly require parentheses to be closed for functions to work. <br>
* *Responsive Design Implementation:* Extensive use of CSS Flexbox, Grid, and media queries (@media) to ensure the calculator's interface scales and functions correctly across a wide range of devices and screen resolutions. <br>
* *Interactive History:* The implementation of a clickable history log allows users to easily review and re-utilize past calculations, enhancing usability and efficiency. <br>
