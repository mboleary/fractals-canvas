
let isInitialized = false;
let canvas = document.getElementById("canvas");
let width = 0;
let height = 0;

let redslider = null;
let greenslider = null;
let blueslider = null;

let red = 0;
let green = 0;
let blue = 0;

// Color Transform
window.tr_red_f = i => i;
window.tr_red_i = false;
window.tr_blue_f = i => i;
window.tr_blue_i = false;
window.tr_green_f = i => i;
window.tr_green_i = false;

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
    initTransformColorControls();
    initControls();
    initMandelbrot();
    drawMandelbrot(MAX_ITER);
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

function initLinearColorControls() {
    redslider = document.getElementById("red");
    greenslider = document.getElementById("green");
    blueslider = document.getElementById("blue");
}

function initTransformColorControls() {
    redslider = document.getElementById("red");
    greenslider = document.getElementById("green");
    blueslider = document.getElementById("blue");
    let trcp = document.querySelectorAll("#colorPanel [for=transform] div input");
    trcp.forEach((item) => {
        if (item.getAttribute("type") !== "range") {
            item.oninput = (e) => {
                let idsplit = e.target.id.split("_");
                let color = idsplit[1];
                let trName = idsplit[2];
                //sin cos sqrt sqrd lin (i)
                let invVal = window["tr_" + color + "_i"];

                console.log("Changed:", color, trName, invVal);
                
                if (trName === "i") {
                    window["tr_" + color + "_i"] = e.target.checked ? true : false;
                } else if (trName === "sin") {
                    window["tr_" + color + "_f"] = (i) => {
                        let res = Math.sin(i);
                        return res;
                    }
                } else if (trName === "cos") {
                    window["tr_" + color + "_f"] = (i) => {
                        let res = Math.cos(i);
                        return res;
                    }
                } else if (trName === "sqrt") {
                    window["tr_" + color + "_f"] = (i) => {
                        let res = Math.sqrt(i);
                        return res;
                    }
                } else if (trName === "sqrd") {
                    window["tr_" + color + "_f"] = (i) => {
                        let res = Math.pow(i, 2);
                        return res;
                    }
                } else if (trName === "lin") {
                    window["tr_" + color + "_f"] = (i) => {
                        let res = i;
                        return res;
                    }
                }
                console.log("Function:", window["tr_" + color + "_f"]);
            }
        }
    });
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
    let zoom = document.querySelector("[for=mandelbrot] #zoom");
    zoom.setAttribute("max", 10.0);
    zoom.setAttribute("min", 1.0);
}

function enablePointSelect() {

}

// Draws from 1 to Selected Iterations per draw
function aniMandelbrot() {
    const init = 1;
    const ms = 100;
    let stop = document.querySelector("[for=mandelbrot] #maxiter").value;
    let i = init;
    red = redslider.value;
    green = greenslider.value;
    blue = blueslider.value;
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
    console.log("Max Iter:", maxiter);
    red = redslider.value;
    green = greenslider.value;
    blue = blueslider.value;
    console.log(window.tr_red_f, window.tr_red_i);
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
            while (x*x + y*y <= 4 && iter < maxiter) {
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
            calcAndInsertColorsTransform(iter, maxiter, arrpos, imgdata);
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
    imgdata.data[arrpos] = (iter/maxiter) * red; // RED
    imgdata.data[arrpos + 1] = (iter/maxiter) * green; // GREEN
    imgdata.data[arrpos + 2] = (iter/maxiter) * blue; // BLUE
    imgdata.data[arrpos + 3] = 255; // ALPHA
}

function calcAndInsertColorsSinCos(iter, maxiter, arrpos, imgdata) {
    imgdata.data[arrpos] = Math.sin((iter/maxiter) * Math.PI) * red; // RED
    imgdata.data[arrpos + 1] =  Math.cos((iter/maxiter) * Math.PI) * green; // GREEN
    imgdata.data[arrpos + 2] = Math.sqrt(iter/maxiter) * blue; // BLUE
    imgdata.data[arrpos + 3] = 255; // ALPHA
}

function calcAndInsertColorsTransform(iter, maxiter, arrpos, imgdata) {
    if (tr_red_i) {
        imgdata.data[arrpos] = (1.0 - tr_red_f(iter/maxiter)) * red; // RED
    } else {
        imgdata.data[arrpos] = tr_red_f(iter/maxiter) * red; // RED
    }
    if (tr_green_i) {
        imgdata.data[arrpos + 1] = (1.0 - tr_green_f(iter/maxiter)) * green; // GREEN
    } else {
        imgdata.data[arrpos + 1] = tr_green_f(iter/maxiter) * green; // GREEN
    }
    if (tr_blue_i) {
        imgdata.data[arrpos + 2] = (1.0 - tr_blue_f(iter/maxiter)) * blue; // BLUE
    } else {
        imgdata.data[arrpos + 2] = tr_blue_f(iter/maxiter) * blue; // BLUE
    }
    imgdata.data[arrpos + 3] = 255; // ALPHA
}