var snake = [[4, 4], [4, 3], [4, 2], [4, 1]]
const list = document.getElementsByClassName("game-block")
var food
var speed = 100
var direction = 4
var myelem = document.getElementsByClassName("game-container")[0]
var mc = new Hammer(myelem);
const gameover_modal = new ModalJS({
    title: 'Game Over',
    body: 'Game is over. Do you want to play again.<br><br> Liked the game? Consdier <a href="#" onclick="javascript:navigator.share({url:`https://shlok-jain.github.io/snake`})">sharing</a> with others',
    theme: 'light',
    custom_buttons: [
        {
            text: 'PLAY AGAIN',
            theme: 'green',
            onclick: () => { restart(); gameover_modal.hide() },
        },
        {
            text: 'ADJUST SPEED',
            theme: 'blue',
            onclick: () => { speed_modal.show(); gameover_modal.hide() },
        }
    ],
    close_btn_text: "CLOSE",
    draggable: true,
    close_on_out_click: false,
    hide_close_btn:true
})
const speed_modal = new ModalJS({
    title: 'Speed Adjustment',
    body: ' Speed Control: <input type="range" id="speed" min="1" max="5"/>',
    theme: 'light',
    close_btn_text: "SAVE AND PLAY",
    draggable: true,
    close_on_out_click: false,
    onclose: () => {
        switch (document.getElementById("speed").value) {
            case "1":
                speed = 150;
                break
            case "2":
                speed = 120;
                break
            case "3":
                speed = 100
                break
            case "4":
                speed = 80
                break
            case "5":
                speed = 50
                break

        }; restart()}
})
const gamestart_modal = new ModalJS({
    title: 'Snake - By Shlok Jain',
    body: 'Welcome to Snake Game - By Shlok Jain <br> <br> How to play: <ul style="margin:auto;margin-left:20px;"><li>For computer/laptop use arrow keys</li><li>For mobile devices swipe in game grid.</li></ul>',
    theme: 'light',
    custom_buttons: [
        {
            text: 'START PLAYING',
            theme: 'green',
            onclick: () => {
                window.refreshIntervalId = setInterval(() => {
                    updateSnake();
                    drawsnake()
                }, speed);
                gamestart_modal.hide()
            },
        },
        {
            text: 'ADJUST SPEED',
            theme: 'blue',
            onclick: () => { speed_modal.show(); gamestart_modal.hide() },
        }
    ],
    close_btn_text: "CLOSE",
    draggable: true,
    close_on_out_click: false,
    hide_close_btn:true
})
// 1 for up
// 2 for left
// 3 for right
// 4 for down

mc.on("swipeleft swipeup swipedown swiperight", (ev) => {
    switch (ev.type) {
        case "swipeup":
            if (direction != 4)
                direction = 1;
            break;
        case "swipedown":
            if (direction != 1)
                direction = 4;
            break;
        case "swipeleft":
            if (direction != 3)
                direction = 2;
            break;
        case "swiperight":
            if (direction != 2)
                direction = 3;
            break;
    }
})

mc.get('swipe').set({
    direction: Hammer.DIRECTION_ALL,
    threshold: 1, 
    velocity:0.1
  });

const drawsnake = function () {
    for (let r = 0; r < list.length; r++) {
        list[r].classList.remove("snake-present")
    }
    for (let i = 0; i < snake.length; i++) {
        if (snake[i][0] <= 19 && snake[i][0] >= 0 && snake[i][1] <= 19 && snake[i][1] >= 0)
            document.getElementById(`block-${snake[i][0]}-${snake[i][1]}`).classList.add("snake-present")
    }
}

const generateFood = function () {
    if (food) {
        document.getElementById(`block-${food[0]}-${food[1]}`).classList.remove("food")
    }
    var x = Math.floor(Math.random() * (19 - 0 + 1)) + 0;
    var y = Math.floor(Math.random() * (19 - 0 + 1)) + 0;

    document.getElementById(`block-${x}-${y}`).classList.add("food")

    food = [x, y]
}

const updateSnake = function () {
    var head = [...snake[0]]
    switch (direction) {
        case 1:    //up
            head[1]--
            break
        case 2:     //left 
            head[0]--
            break
        case 3:     //right
            head[0]++
            break
        case 4:      //down
            head[1]++
            break
    }
    snake.unshift(head)
    if (head[0] == food[0] && head[1] == food[1]) {
        generateFood()
        document.getElementById('score').innerText = snake.length
        if (parseInt(localStorage.getItem("highscore")) < snake.length) {
            localStorage.setItem("highscore", snake.length);
            document.getElementById("highscore").innerText = localStorage.getItem("highscore")
        }
    }
    else {
        snake.pop()
    }

    for (let i = 0; i < snake.length; i++) {
        if (!(snake[i][0] <= 19 && snake[i][0] >= 0 && snake[i][1] <= 19 && snake[i][1] >= 0)) {
            gameOver();
        }
        if ((snake[0][0] == snake[i][0]) && ((snake[0][1] == snake[i][1])) && i != 0) {
            gameOver()
        }
    }
}

const restart = function () {
    snake = [[4, 4], [4, 3], [4, 2], [4, 1]];
    document.getElementById('score').innerText = 0;
    direction = 4;
    generateFood();
    drawsnake();
    window.refreshIntervalId = setInterval(() => {
        updateSnake();
        drawsnake()
    }, speed);
}

const gameOver = function () {
    clearInterval(window.refreshIntervalId)
    gameover_modal.show()
}

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowUp":
            if (direction != 4)
                direction = 1;
            break;
        case "ArrowDown":
            if (direction != 1)
                direction = 4;
            break;
        case "ArrowLeft":
            if (direction != 3)
                direction = 2;
            break;
        case "ArrowRight":
            if (direction != 2)
                direction = 3;
            break;
    }
});

drawsnake()
generateFood()

window.onload = function () {
    if (localStorage.getItem("highscore")) {
        document.getElementById("highscore").innerText = localStorage.getItem("highscore")
    }
    else {
        localStorage.setItem("highscore", 0)
        document.getElementById("highscore").innerText = localStorage.getItem("highscore")
    }
    gamestart_modal.show()
}
