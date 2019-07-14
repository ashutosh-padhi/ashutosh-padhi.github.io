var dx = 0, dy = 0, sdx = 0, sdy = 0, fdx = 0, fdy = 0, odx, ody, drawlock = false, zoom = 1, startingCordinateX = 2, startingCordinateY = 2;

function setup() {
    createCanvas(innerWidth, innerHeight);
    var ar = innerWidth / innerHeight;
    startingCordinateY = startingCordinateX / ar;
    textSize(12);
    drawMandelbrotSet();
}

function mousePressed() {
    sdx = mouseX;
    sdy = mouseY;
    odx = fdx;
    ody = fdy;
}

function mouseDragged() {
    dx = map(mouseX - sdx, 0, width, 0 * zoom, 2 * startingCordinateX * zoom);
    dy = map(mouseY - sdy, 0, height, 0 * zoom, 2 * startingCordinateY * zoom);

    fdx = odx + dx;
    fdy = ody + dy;


    if (!drawlock) {
        drawlock = true;
        setTimeout(() => {
            drawMandelbrotSet();
            drawlock = false
        }, 50);
    }

}

function mouseWheel(e) {
    if (e.delta < 0) {
        zoom /= 2;
    } else {
        zoom *= 2;
    }
    drawMandelbrotSet();

}

function drawMandelbrotSet() {
    var neg_x = -(startingCordinateX) * zoom - fdx,
        pos_x = startingCordinateX * zoom - fdx,
        neg_y = -(startingCordinateY) * zoom - fdy,
        pos_y = startingCordinateY * zoom - fdy;
    pixelDensity(1);
    loadPixels();
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {

            var a = map(x, 0, width, neg_x, pos_x), ca = a;
            var b = map(y, 0, height, neg_y, pos_y), cb = b;


            var n = 0;
            var z = 0;

            while (n < 100) {
                var an = a * a - b * b;
                var bn = 2 * a * b;

                if (abs(a) + abs(b) > 16) {
                    break;
                }

                a = an + ca;
                b = bn + cb;

                n++;
            }

            var bright = map(n, 0, 100, 0, 255);
            var bright2 = map(n, 0, 100, 255, 0);
            var bright3 = map(n % 30, 0, 30, 255, 0);
            if (n === 100) {
                bright = 0;
                bright2 = 0;
                bright3 = 0;
            }

            var pix = (x + y * width) * 4;
            pixels[pix + 0] = bright;
            pixels[pix + 1] = bright2;
            pixels[pix + 2] = bright3;
            pixels[pix + 3] = 255;
        }
    }
    updatePixels();
    showStats(neg_x, pos_x, neg_y, pos_y, zoom);
}

function showStats(neg_x, pos_x, neg_y, pos_y, z) {
    fill(0, 0, 0, 150);
    strokeWeight(0);
    rect(width - 240, 0, 240, 60);
    fill(255, 255, 0);
    strokeWeight(4);
    text('x: [ ' + neg_x.toFixed(10) + ' , ' + pos_x.toFixed(10) + ' ]', width - 220, 20);
    text('y: [ ' + neg_y.toFixed(10) + ' , ' + pos_y.toFixed(10) + ' ]', width - 220, 35);
    text('zoom: ' + (1 / z), width - 220, 50)
}