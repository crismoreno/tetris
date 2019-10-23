const canvas = document.getElementById('tetrisboard');
const context = canvas.getContext('2d');


// https://www.w3schools.com/tags/canvas_scale.asp
context.scale(20, 20);

context.fillStyle = "#000";
// https://developer.mozilla.org/es/docs/Web/API/CanvasRenderingContext2D/fillRect
context.fillRect(0, 0, canvas.width, canvas.height);


const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
]


// https://www.w3schools.com/jsref/jsref_foreach.asp
function drawMatrix(matrix){
    matrix.forEach((row, y) => {
        row.forEach((value, x) =>{
            if (value !== 0){
                context.fillStyle = 'red';
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

drawMatrix(matrix);
