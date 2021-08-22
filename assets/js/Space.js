const canvas = Nucleus.$('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const context = canvas.getContext('2d');
console.log('Context:', context);

//canvas.onclick = e => canvas.requestFullscreen();
