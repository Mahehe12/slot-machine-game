/* 
1. Deposit some money
2. Determine number of lines to bet on
3. Collect bet amount
4. Spin the slot machine
5. check if user has won
6. Give the user their winnings
7. play again
*/

// Global variables
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { // stores objects keys/prop/attrbs -> value
    A: 2,
    B: 2,
    C: 6,
    D: 8
}; // SYMBOLS_COUNT is written in Snake case

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}; // if we get A we mutiply bet by 5

// UI Elements
const balanceDisplay = document.getElementById("balance");
const depositInput = document.getElementById("deposit");
const linesInput = document.getElementById("lines");
const betInput = document.getElementById("bet");

const depositBtn = document.getElementById("depositBtn");
const spinBtn = document.getElementById("spinBtn");

const winMessage = document.getElementById("winMessage");
const winAmountSpan = document.getElementById("winAmount");
const errorMessage = document.getElementById("errorMessage");

const reelsDivs = [
    document.getElementById("row1").children,
    document.getElementById("row2").children,
    document.getElementById("row3").children
];

let balance = 0;

// ES6 version to write a function
const deposit = (amount) => {
    // We created an infinite loop 
    const numberDepositamount = parseFloat(amount); // What we get as a default inp is string -> number

    // isNan is a func to check a number
    if (isNaN(numberDepositamount) || numberDepositamount <= 0) {
        showError("Invalid deposit amount, try again.");
    } else {
        balance += numberDepositamount;
        updateBalance();
        clearMessages();
    }
};

const getNumberOfLines = () => {
    // We created an infinite loop 
    const lines = linesInput.value;
    const numberOfLines = parseFloat(lines); // What we get as a default inp is string -> number

    // isNan is a func to check a number
    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
        showError("Invalid number of lines, try again.");
        return null;
    } else {
        return numberOfLines;
    }
};

const getBet = (lines) => {
    // We created an infinite loop 
    const bet = betInput.value;
    const numberBet = parseFloat(bet); // What we get as a default inp is string -> number

    // isNan is a func to check a number
    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
        showError("Invalid bet, try again.");
        return null;
    } else {
        return numberBet;
    }
};

const spin = () => {
    const symbols = []; // An array which is known as reference data type which means we can manipulate the array without changing the ref to the arr itself
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        // console.log(symbol, count); A 2, B 2, C 6, D 8
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [[], [], []];
    // Nested loops for nested arrays 
    for (let i = 0; i < COLS; i++) {
        // for each reel/col what's inside of it
        const reelSymbols = [...symbols];
        // We copy the symbols array because for each reel we have to pick elts and we will have to add and remove elts. If we remove elts from sybmols it'll be a porblem
        for (let j = 0; j < ROWS; j++) {
            // for each single col we need to pick x elements
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); // Rounds this number down to lowest no.
            const selectedSymbols = reelSymbols[randomIndex];
            reels[i].push(selectedSymbols);
            reelSymbols.splice(randomIndex, 1); //remove 1 elt
        }
    }
    return reels;
};

const transpose = (reels) => {
    let rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]); // Create a new empty row
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]); // Pick the element from the column and push to the row
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const symbol = rows[i][j];
            const cell = reelsDivs[i][j];
            cell.textContent = symbol;
            cell.className = `symbol ${symbol}`;
        }
    }
};

const getsWinnings = (rows, bet, lines) => {
    let winnings = 0; // Initialize winnings to zero
    for (let row = 0; row < lines; row++) { // Loop through the rows up to the number of lines
        const symbols = rows[row]; // Get the symbols in the current row
        let allSame = true; // Assume all symbols are the same initially

        for (const symbol of symbols) { // Loop through symbols in the row
            if (symbol != symbols[0]) { // Check if the symbol is different from the first symbol
                allSame = false; // If not, set allSame to false
            }
        }

        if (allSame) { // If all symbols in the row are the same
            winnings += bet * SYMBOLS_VALUES[symbols[0]]; // Add winnings based on the bet and symbol value
        }
    }
    return winnings; // Return the total winnings
};

const updateBalance = () => {
    balanceDisplay.textContent = balance.toFixed(2);
};

const showError = (msg) => {
    errorMessage.textContent = msg;
    errorMessage.classList.remove("hidden");
};

const clearMessages = () => {
    errorMessage.classList.add("hidden");
    winMessage.classList.add("hidden");
};

depositBtn.addEventListener("click", () => {
    deposit(depositInput.value);
});

spinBtn.addEventListener("click", () => {
    clearMessages();
    const numberOfLines = getNumberOfLines();
    if (numberOfLines === null) return;

    const bet = getBet(numberOfLines);
    if (bet === null) return;

    balance -= bet * numberOfLines;

    const reels = spin(); // Spin the slot machine
    const rows = transpose(reels); // Transpose the reels to get rows
    printRows(rows); // Print the rows
    const winnings = getsWinnings(rows, bet, numberOfLines); // Calculate winnings
    balance += winnings; // Add winnings to the balance
    updateBalance();

    if (winnings > 0) {
        winAmountSpan.textContent = winnings.toFixed(2);
        winMessage.classList.remove("hidden");
    }
});
