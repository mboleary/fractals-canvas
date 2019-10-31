
let isInitialized = false;
let canvas = document.getElementById("canvas");
let width = 0;
let height = 0;

const MAX_ITER = 1000;

// function draw() {
//     let width = window.screen.width;
//     let height = window.screen.height;
//     // let width = 80;
//     // let height = 80;
//     let canvas = document.getElementById("canvas");
//     canvas.setAttribute("width", width);//Set the Canvas size to the native screen resolution
//     canvas.setAttribute("height", height);
//     let ctx = canvas.getContext("2d"); //Drawing is rendered Here!

//     ctx.fillRect(0, 0, width, height);
    
//     let imgdata = ctx.getImageData(0, 0, width, height);

//     // https://en.wikipedia.org/wiki/Mandelbrot_set

//     const MAX_ITER = 1000;

//     for (let px = 0;px < width; px++) {
//         for (let py = 0; py < height; py++) {
//             let x0 = ((px / width) * 3.5) - 2.5;
//             let y0 = ((py / height) * 2) - 1.0;
//             let x = 0.0;
//             let y = 0.0;
//             let iter = 0;
//             while (x*x + y*y <= 2*2 && iter < MAX_ITER) {
//                 let xtemp = x*x - y*y + x0;
//                 y = 2*x*y + y0;
//                 x = xtemp;
//                 iter += 1;
//             }
//             let arrpos = (px + (py * width)) * 4;
//             // console.log(arrpos);
//             imgdata.data[arrpos] = (iter/MAX_ITER) * 255; // RED
//             imgdata.data[arrpos + 1] = (iter/MAX_ITER) * 255; // GREEN
//             imgdata.data[arrpos + 2] = (iter/MAX_ITER) * 255; // BLUE
//             imgdata.data[arrpos + 3] = 255; // ALPHA
//         }
//     }
//     ctx.putImageData(imgdata, 0, 0);
// }

function init() {
    initDraw();
    initControls();
    initMandelbrot();
    drawMandelbrot(MAX_ITER);
    showControlsFor("mandelbrot");
}

/**
 * Initialize the canvas
 */
function initDraw() {
    width = window.screen.width;
    height = window.screen.height;
    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", width);//Set the Canvas size to the native screen resolution
    canvas.setAttribute("height", height);
}

function initControls() {
    let red = document.getElementById("red");
    red.setAttribute("min", 0);
    red.setAttribute("max", 255);
    let green = document.getElementById("green");
    green.setAttribute("min", 0);
    green.setAttribute("max", 255);
    let blue = document.getElementById("blue");
    blue.setAttribute("min", 0);
    blue.setAttribute("max", 255);
}

function showControlsFor(fractal) {
    let controlView = document.querySelector("#controlView");
    let children = controlView.children;
    const attr = "for";
    for (let i = 0; i < children.length; i++) {
        let child = children[0];
        let type = child.getAttribute(attr);
        console.log("Processing Control Group:", child, type);
        if (type == fractal) {
            child.removeAttribute("hidden");
        } else {
            child.setAttribute("hidden", "true");
        }
    }
}

function initMandelbrot() {
    showControlsFor("mandelbrot");
    let maxiter = document.querySelector("[for=mandelbrot] #maxiter");
    maxiter.setAttribute("max", MAX_ITER);
    maxiter.setAttribute("min", 0);

}

// Draws from 1 to Selected Iterations per draw
function aniMandelbrot() {
    const init = 1;
    const ms = 100;
    let stop = document.querySelector("[for=mandelbrot] #maxiter").value;
    let i = init;
    let interval = setInterval(() => {
        if (i > stop) {
            clearInterval(interval);
            console.log("Animation Stopped!");
            return;
        }
        drawMandelbrot(i);
        i += 1;
    }, ms)
}

// Draw Mandelbrot using values from control panel
function cpDrawMandelbrot() {
    let maxiter = document.querySelector("[for=mandelbrot] #maxiter").value;
    console.log("Max Iter:", maxiter)
    drawMandelbrot(maxiter);
}

function drawMandelbrot(maxiter) {
    let ctx = canvas.getContext("2d"); //Drawing is rendered Here!

    ctx.fillRect(0, 0, width, height);
    
    let imgdata = ctx.getImageData(0, 0, width, height);

    // https://en.wikipedia.org/wiki/Mandelbrot_set

    for (let px = 0;px < width; px++) {
        for (let py = 0; py < height; py++) {
            let x0 = ((px / width) * 3.5) - 2.5;
            let y0 = ((py / height) * 2) - 1.0;
            let x = 0.0;
            let y = 0.0;
            let iter = 0;
            while (x*x + y*y <= 2*2 && iter < maxiter) {
                let xtemp = x*x - y*y + x0;
                y = 2*x*y + y0;
                x = xtemp;
                iter += 1;
            }
            let arrpos = (px + (py * width)) * 4;
            // console.log(arrpos);
            // imgdata.data[arrpos] = (iter/maxiter) * 255; // RED
            // imgdata.data[arrpos + 1] = (iter/maxiter) * 255; // GREEN
            // imgdata.data[arrpos + 2] = (iter/maxiter) * 255; // BLUE
            // imgdata.data[arrpos + 3] = 255; // ALPHA
            calcAndInsertColorsLinear(iter, maxiter, arrpos, imgdata);
        }
    }
    ctx.putImageData(imgdata, 0, 0);
}

//Original Color Insertion (Linear Monochrome)
function calcAndInsertColors(iter, maxiter, arrpos, imgdata) {
    imgdata.data[arrpos] = (iter/maxiter) * 255; // RED
    imgdata.data[arrpos + 1] = (iter/maxiter) * 255; // GREEN
    imgdata.data[arrpos + 2] = (iter/maxiter) * 255; // BLUE
    imgdata.data[arrpos + 3] = 255; // ALPHA
}

function calcAndInsertColorsLinear(iter, maxiter, arrpos, imgdata) {
    let red = document.getElementById("red").value;
    let green = document.getElementById("green").value;
    let blue = document.getElementById("blue").value;
    imgdata.data[arrpos] = (iter/maxiter) * red; // RED
    imgdata.data[arrpos + 1] = (iter/maxiter) * green; // GREEN
    imgdata.data[arrpos + 2] = (iter/maxiter) * blue; // BLUE
    imgdata.data[arrpos + 3] = 255; // ALPHA
}
