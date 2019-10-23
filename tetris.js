const canvas = document.getElementById('tetrisboard');
const context = canvas.getContext('2d');


context.fillStyle = "#000";
// https://developer.mozilla.org/es/docs/Web/API/CanvasRenderingContext2D/fillRect
context.fillRect(0, 0, canvas.width, canvas.height);