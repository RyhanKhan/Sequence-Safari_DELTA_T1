//Game Constants and variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 5;
let score = 0;
let currentTime = 20;
let hiscoreval = 0;
let lastPaintTime = 0;
let isGameStarted = false;
let snakeArr = [
    { x: 13, y: 15 },
    { x: 13, y: 16 },
    { x: 13, y: 17 }
]
food = { x: 6, y: 7 };
food2 = { x: 8, y: 9 };
food3 = { x: 14, y: 15 };
food4 = { x: 11, y: 5 };
let count = 4;
let colorArray = [
    ['red', 'lime', 'purple', 'yellow'],
    ['lime', 'red', 'yellow', 'purple'],
    ['yellow', 'lime', 'red', 'purple'],
    ['red', 'purple', 'lime', 'yellow'],
    ['purple', 'lime', 'red', 'yellow']
];
let colorSequence = [];
let ourSequence = [];


//Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    //If you bump into yourself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    //If you bump into the wall
    if (snake[0].x >= 21 || snake[0].x <= 0 || snake[0].y >= 21 || snake[0].y <= 0) {
        return true;
    }
    if (currentTime === 0) {
        return true;
    }
    return false;
}

function generateColorSequence() {
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    colorSequence = colorArray[randomIndex];
}
generateColorSequence();

function displayColorSequence() {
    const sequenceElement = document.getElementById('sequenceKyaHai');
    sequenceElement.textContent = 'Sequence: ' + colorSequence.join(' ');
}

// Call the displayColorSequence function at the beginning of the game
displayColorSequence();

function updateTime() {
    console.log("called")
    document.getElementById('timerBox').innerText = `Time remaining: ${currentTime--}`
}
// setInterval(() => updateTime(), 1000)

function gameEngine() {

    // Generate a random position for the food that is not on the snake's body
    function generateFoodPosition() {
        let newFoodPosition;
        while (!newFoodPosition || isSnakeOnPosition(newFoodPosition)) {
            let a = 2;
            let b = 19;
            newFoodPosition = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        }
        return newFoodPosition;
    }

    //Take food outside the grid

    function makeFoodDisappear() {
        let newFoodPosition;
        while (!newFoodPosition || isSnakeOnPosition(newFoodPosition)) {
            let a = 22;
            let b = 22;
            newFoodPosition = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        }
        return newFoodPosition;
    }


    // Check if the given position overlaps with the snake's body
    function isSnakeOnPosition(position) {
        return snakeArr.some(e => e.x === position.x && e.y === position.y);
    }

    //Part 1: Updating the snake array & food
    if (isCollide(snakeArr)) {
        count = 4;
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Press any key to play again");
        snakeArr = [{ x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }];
        food = generateFoodPosition();
        food2 = generateFoodPosition();
        food3 = generateFoodPosition();
        food4 = generateFoodPosition();
        //musicSound.play();
        score = 0;
        speed = 5;
        currentTime = 20;
        ourSequence = [];
        scoreBox.innerHTML = "Score: " + score;
        generateColorSequence();
        displayColorSequence();

    }

    function foodHasBeenEaten() {
        count--;
        foodSound.play();
        // speed = speed + 0.5;
        // score += 1;
        currentTime += 2;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
            let hehe = document.getElementById("hiscoreBox");
            hehe.innerHTML = "HiScore: " + hiscoreval;
        }
        // scoreBox.innerHTML = "Score: " + score;
        // snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
    }

    //If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        food = makeFoodDisappear();
        ourSequence.push("red");
        foodHasBeenEaten();

    }
    if (snakeArr[0].y === food2.y && snakeArr[0].x === food2.x) {
        food2 = makeFoodDisappear();
        ourSequence.push("lime");
        foodHasBeenEaten();
    }
    if (snakeArr[0].y === food3.y && snakeArr[0].x === food3.x) {
        food3 = makeFoodDisappear();
        ourSequence.push("purple");
        foodHasBeenEaten();
    }
    if (snakeArr[0].y === food4.y && snakeArr[0].x === food4.x) {
        food4 = makeFoodDisappear();
        ourSequence.push("yellow");
        foodHasBeenEaten();
    }
    function checkSequence() {
        for (let i = 0; i <= 3; i++) {
            if (colorSequence[i] !== ourSequence[i]) {
                return false; // If any color does not match, return false immediately
            }
        }
        return true; // If all colors match, return true
    }
    if (count === 0) {
        if (checkSequence()) {
            // Regenerate the food in a valid position
            generateColorSequence();
            displayColorSequence();
            ourSequence = [];
            count = 4;
            speed += 1;;
            score += 4;
            scoreBox.innerHTML = "Score: " + score;
            snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
            food = generateFoodPosition();
            food2 = generateFoodPosition();
            food3 = generateFoodPosition();
            food4 = generateFoodPosition();
        }
        else {
            count = 4;
            gameOverSound.play();
            musicSound.pause();
            inputDir = { x: 0, y: 0 };
            alert("Game Over! Press any key to play again");
            snakeArr = [{ x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }];
            food = generateFoodPosition();
            food2 = generateFoodPosition();
            food3 = generateFoodPosition();
            food4 = generateFoodPosition();
            //musicSound.play();
            score = 0;
            speed = 5;
            currentTime = 20;
            ourSequence = [];
            scoreBox.innerHTML = "Score: " + score;
            generateColorSequence();
            displayColorSequence();

        }

    }


    // Moving the snake
    // Check if there is any input direction
    if (inputDir.x !== 0 || inputDir.y !== 0) {
        // Move the tail to the previous position of the last body tile
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
        // Move the head based on the input direction
        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;
    }

    //Part 2: Display the snake and food

    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    })

    //Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    food2Element = document.createElement('div');
    food2Element.style.gridRowStart = food2.y;
    food2Element.style.gridColumnStart = food2.x;
    food2Element.classList.add('food2');
    board.appendChild(food2Element);

    food3Element = document.createElement('div');
    food3Element.style.gridRowStart = food3.y;
    food3Element.style.gridColumnStart = food3.x;
    food3Element.classList.add('food3');
    board.appendChild(food3Element);

    food4Element = document.createElement('div');
    food4Element.style.gridRowStart = food4.y;
    food4Element.style.gridColumnStart = food4.x;
    food4Element.classList.add('food4');
    board.appendChild(food4Element);
}


//Main logic starts here

let hiscore = localStorage.getItem("hiscore");

if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreBox = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}


window.requestAnimationFrame(main);

//adding keyboard commands
window.addEventListener('keydown', function (event) {
    keyClick(event.key);
});

//function to detect input
function keyClick(e) {
    moveSound.play();
    if (!isGameStarted) {
        isGameStarted = true;
        setInterval(() => updateTime(), 1000);
    }
    switch (e) {
        case "ArrowUp":
            if (inputDir.y !== 1) {
                console.log("ArrowUp");
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;

        case "ArrowDown":
            if (inputDir.y !== -1) {
                console.log("ArrowDown");
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;

        case "ArrowLeft":
            if (inputDir.x !== 1) {
                console.log("ArrowLeft");
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;

        case "ArrowRight":
            if (inputDir.x !== -1) {
                console.log("ArrowRight");
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;

        default:
            break;
    }
}

//Adding button commands
let buttonNum = document.querySelectorAll(".buttonwa");
for (let i = 0; i < buttonNum.length; i++) {
    buttonNum[i].addEventListener("click", myFunc);
}
function myFunc() {
    let buttonInnerHTML = this.innerHTML;

    keyClick(buttonInnerHTML);
}