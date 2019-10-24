const canvas = document.getElementById('tetrisboard');
const context = canvas.getContext('2d');

const startGameButton = document.getElementById('startGame');
const pauseGameButton = document.getElementById('pauseGame');
const resumeGameButton = document.getElementById('resumeGame');

startGameButton.addEventListener("click", function() { startGame() });
pauseGameButton.addEventListener("click", function() { pauseGame() });
resumeGameButton.addEventListener("click", function() { resumeGame() });

var sounds = {
    bg: new Audio("assets/Tetris.ogg"),
    success: new Audio("assets/jose-yeahright.m4a")
};

// https://www.w3schools.com/tags/canvas_scale.asp
context.scale(20, 20);


function arenaSweep(){
    let rowCount = 1; 
    outer: for (let y = arena.length -1; y > 0; --y ){
        for (let x = 0; x < arena[y].length; ++x){
            if(arena[y][x] === 0){
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;


        sounds.success.load()
        sounds.success.addEventListener("canplaythrough", function() {
        sounds.success.play().then(_ => {
            console.log("PLAY SUCCESSSS");
        }).catch(error => {
            console.log(error.message)
        });;
    }, true);
    }
}


function collide (arena, player){
    const [m, o] = [player.matrix, player.pos]; 
    for(let y=0; y < m.length; ++y ){
        for(let x=0; x < m[y].length; ++x){
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0 ){
                return true;
            }
        }
    }
    return false;
}


function createMatrix(w, h){
    const matrix = [];
    while(h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}


function createPiece(type){
    switch (type){
    case 'T':
        return[
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]
    break;

    case 'O':
        return[
            [2, 2],
            [2, 2]
        ]
    break;

    case 'L':
        return[
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ]    
    break;

    case 'J':
        return[
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ]    
    break;

    case 'I':
        return[
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ]    
    break;

    case 'S':
        return[
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ]    
    break;

    case 'Z':
        return[
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ]    
    break;
    }
}



function draw(){
    context.fillStyle = "#000";
    // https://developer.mozilla.org/es/docs/Web/API/CanvasRenderingContext2D/fillRect
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x:0, y:0});
    drawMatrix(player.matrix, player.pos);
}


// https://www.w3schools.com/jsref/jsref_foreach.asp
function drawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
        row.forEach((value, x) =>{
            if (value !== 0){
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}


function merge (arena, player){
    player.matrix.forEach((row, y)  => {
        row.forEach((value, x) => {
            if (value !== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    }) 
}

function playerDrop(){
    player.pos.y++;
    if(collide(arena, player)){
        player.pos.y--;
        merge(arena, player);
        playerReset();
        // player.pos.y = 0;
        arenaSweep();
        updateScore();
    };
    dropCounter = 0;
}

function playerMove(dir){
    player.pos.x += dir;
    if(collide(arena, player)){
        player.pos.x -= dir;
    }
}

function playerReset(){
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - 
                    (player.matrix[0].length / 2 | 0);

    if(collide(arena, player)){
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir){
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while(collide(arena, player)){
        player.pos.x += offset;
        offset =- (offset + (offset > 0 ? 1 : -1));
        if(offset > player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir){
    for (let y = 0; y < matrix.length; ++y){
        for(let x = 0; x < y; ++x){
            [
                matrix[x][y], 
                matrix[y][x]
            ] = [
                matrix[y][x], 
                matrix[x][y]
            ];
        }
    }
    if (dir > 0){
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    } 
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

var playStory;

function update (time = 0){
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if(dropCounter > dropInterval){
        playerDrop();
    }
    draw();
    // https://developer.mozilla.org/es/docs/Web/API/Window/requestAnimationFrame
    
    playStop = requestAnimationFrame(update);
}

function updateScore(){
    document.getElementById('score').innerText = player.score + " POINTS";
}


const colors = [
    null, 
    'red', 
    'blue', 
    'violet', 
    'purple',
    'orange', 
    'teal', 
    'pink'
]
const arena = createMatrix(12, 20); 


const player = {
    pos: {x:0, y:0},
    matrix: null,
    score: 0
}


document.getElementById('left').addEventListener("click", function() { playerMove(-1) });
document.getElementById('right').addEventListener("click", function() { playerMove(1) });
document.getElementById('down').addEventListener("click", function() { playerDrop() });
document.getElementById('rotate').addEventListener("click", function() { playerRotate(1); });




// http://pomle.github.io/keycode/
document.addEventListener('keydown', event =>{
    if(event.keyCode === 37){
        // left arrow
        playerMove(-1);
    }else if (event.keyCode === 39){
        // right arrow
        playerMove(1);
    }else if (event.keyCode === 40){
        // down arrow
        playerDrop();
    }else if (event.keyCode === 81){
        playerRotate(1);
    }
    //else if (event.keyCode === 87){
    //     playerRotate(1);
    // }
});

function playBgSound() {
    sounds.bg.load()
    sounds.bg.addEventListener("canplaythrough", function() {
        sounds.bg.play().then(_ => {
            console.log("PLAY");
        }).catch(error => {
            console.log(error.message)
        });;
    }, true);


    
}
sounds.bg.addEventListener('ended', function() {
    console.log('canción terminada');
    this.currentTime = 0;
    playBgSound();
}, false);

var isPaused = true;
function startGame() {
    startGameButton.style.display = "none";
    pauseGameButton.style.display = "inline-block";
    isPaused = false;
    playBgSound();
    playerReset();
    updateScore();
    if (!isPaused){
        update();
    }
}

window.onkeydown = function() {
    isPaused = !isPaused; // flips the pause state
};



function pauseGame(){
    var isPaused = true;
    pauseGameButton.style.display = "none";
    resumeGameButton.style.display = "inline-block";

    window.cancelAnimationFrame(playStop);

    sounds.bg.pause()

}

function resumeGame(){
    resumeGameButton.style.display = "none";
    pauseGameButton.style.display = "inline-block";
    update();
    sounds.bg.play()
}

