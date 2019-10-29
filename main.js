
function draw() {
    let width = window.screen.width;
    let height = window.screen.height;
    // let width = 80;
    // let height = 80;
    let canvas = document.getElementById("canvas");
    canvas.setAttribute("width", width);//Set the Canvas size to the native screen resolution
    canvas.setAttribute("height", height);
    let ctx = canvas.getContext("2d"); //Drawing is rendered Here!

    ctx.fillRect(0, 0, width, height);
    
    let imgdata = ctx.getImageData(0, 0, width, height);

    // https://en.wikipedia.org/wiki/Mandelbrot_set

    const MAX_ITER = 1000;

    for (let px = 0;px < width; px++) {
        for (let py = 0; py < height; py++) {
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
            imgdata.data[arrpos] = (iter/MAX_ITER) * 255; // RED
            imgdata.data[arrpos + 1] = (iter/MAX_ITER) * 255; // GREEN
            imgdata.data[arrpos + 2] = (iter/MAX_ITER) * 255; // BLUE
            imgdata.data[arrpos + 3] = 255; // ALPHA
        }
    }
    ctx.putImageData(imgdata, 0, 0);
}
