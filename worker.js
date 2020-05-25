// WebWorker Implementation of Rendering part of the fracal

const MAX_ITER = 1000;

const int16 = Math.pow(2, 16);

onconnect = function(e) {
    const port = e.ports[0];

    port.onmessage = function(e) {
        let startX = e.data.startX;
        let startY = e.data.startY;
        let endX = e.data.endX;
        let endY = e.data.endY;
        let width = e.data.width;
        let height = e.data.height;

        let retArr = [];

        for (let px = startX;px < endX; px++) {
            for (let py = startY; py < endY; py++) {
                let x0 = ((px / width) * 3.5) - 2.5;
                let y0 = ((py / height) * 2) - 1.0;
                let x = 0.0;
                let y = 0.0;
                let iter = 0;
                while (x*x + y*y <= 2*2 && iter < MAX_ITER) {
                    let xtemp = x*x - y*y + x0;
                    y = 2*x*y + y0;
                    x = xtemp;
                    iter += 1;
                }
                let arrpos = (px + (py * width)) * 4;
                // console.log(arrpos);
                // Mult Value was 255
                let tempColVal = (iter/MAX_ITER) * int16;
                retArr[arrpos + 0] = (((tempColVal >> 11) % 32) / 32) * 255; // BLUE 5
                retArr[arrpos + 1] = (((tempColVal >> 5) % 64) / 64) * 255; // GREEN 6
                retArr[arrpos + 2] = ((tempColVal % 32) / 32) * 255; // RED 5
                // retArr[arrpos] = (iter/MAX_ITER) * tempR; // RED
                // retArr[arrpos + 1] = (iter/MAX_ITER) * tempG; // GREEN
                // retArr[arrpos + 2] = (iter/MAX_ITER) * tempB; // BLUE
                retArr[arrpos + 3] = 255; // ALPHA
            }
        }
        port.postMessage(retArr);
    }
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