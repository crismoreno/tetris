const canvas = document.getElementById('tetrisboard');
const context = canvas.getContext('2d');



// https://www.w3schools.com/tags/canvas_scale.asp
context.scale(20, 20);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
]

function draw(){
    context.fillStyle = "#000";
    // https://developer.mozilla.org/es/docs/Web/API/CanvasRenderingContext2D/fillRect
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(player.matrix, player.pos);
}


// https://www.w3schools.com/jsref/jsref_foreach.asp
function drawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
        row.forEach((value, x) =>{
            if (value !== 0){
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function playerDrop(){
    player.pos.y++;
    dropCounter = 0;
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update (time = 0){
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if(dropCounter > dropInterval){
        playerDrop();
    }
    draw();
    // https://developer.mozilla.org/es/docs/Web/API/Window/requestAnimationFrame
    requestAnimationFrame(update);
}


const player = {
    pos: {x:5, y:5},
    matrix: matrix,
}

document.addEventListener('keydown', event =>{
    if(event.keyCode === 37){
        // left arrow
        player.pos.x--;
    }else if (event.keyCode === 39){
        // right arrow
        player.pos.x++;
    }else if (event.keyCode === 40){
        // down arrow
        playerDrop();
    }
});


update();
