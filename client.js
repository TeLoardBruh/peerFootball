//Establishing a connection with the server on port 5500y
const socket = io('http://localhost:3000');

//Grabbing the button element by the ID
// const HelloBtn = document.getElementById('helloButton');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

// putWallsAround(0, 0, canvas.clientWidth, canvas.clientHeight);
buildStadium()

//Callback function fires on the event called 'serverToClient'
// socket.on('serverToClient', (data) => {
//     alert(data);
// })


let clientBalls = {};
let selfID;
let football;


socket.on('connect', () => {
    selfID = socket.id;
})

socket.on('updateConnection', players => {
    // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    playersFound = {};
    for (let id in players) {
        if (clientBalls[id] === undefined) {
            clientBalls[id] = new Capsule(players[id].x + 35, players[id].y, players[id].x - 35, players[id].y, 25, 10);
            clientBalls[id].maxSpeed = 3;
            clientBalls[id].score = 0;
            clientBalls[id].no = players[id].no;
            if(clientBalls[id].no === 1){
                clientBalls[id].color = "yellow"
            }
            else if(clientBalls[id].no === 2){
                clientBalls[id].color = "lightblue"
            }
            if (id == selfID) {
                userInput(clientBalls[id]);
            }

        }
        playersFound[id] = true;
    }
    for (let id in clientBalls) {
        if (!playersFound[id]) {
            clientBalls[id].remove();
            delete clientBalls[id];
        }
    }
})

socket.on("updateFootabll", (data) => {
    if (football === undefined) {
        football = new Ball(data.x, data.y, 20, 10);
        football.color = "red"
    } else {
        football.setPosition(data.x, data.y)
    }
})

socket.on('updateScore', data => {
    if (data === null) {
        for (let id in clientBalls) {
            clientBalls[id].score = 0;
        }
    } else {

        for (let id in clientBalls) {
            if (id === data) {
                if (clientBalls[id].no === 1) {
                    clientBalls[id].score++;
                } else if (clientBalls[id].no === 2) {
                    clientBalls[id].score++;
                }

            }
        }
    }
})

socket.on('positionUpdate', playerPos => {
    for (let id in playerPos) {
        if (clientBalls[id] !== undefined) {
            clientBalls[id].setPosition(playerPos[id].x, playerPos[id].y, playerPos[id].angle);
        }
    }
})

function userInterface() {
    ctx.font = "30px Arial";
    for (let id in clientBalls) {
        if (clientBalls[id].no === 1) {
            ctx.fillText(clientBalls[id].score, 20, 30);
        } else if (clientBalls[id].no === 2) {
            ctx.fillText(clientBalls[id].score, 600, 30);
        }
    }
}

function buildStadium() {
    new Wall(60, 80, 580, 80);
    new Wall(60, 460, 580, 460);

    new Wall(60, 80, 60, 180);
    new Wall(60, 460, 60, 360);
    new Wall(580, 80, 580, 180);
    new Wall(580, 460, 580, 360);

    new Wall(50, 360, 10, 360);
    new Wall(0, 360, 0, 180);
    new Wall(10, 180, 50, 180);
    new Wall(590, 360, 630, 360);
    new Wall(640, 360, 640, 180);
    new Wall(630, 180, 590, 180);
}

requestAnimationFrame(renderOnly);