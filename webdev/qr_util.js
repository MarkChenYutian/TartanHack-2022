let qrDetector = window.BarcodeDetector ? new window.BarcodeDetector({
    formats: ['qr_code']
}): undefined;

function cleanCanvas() {
    let ctx = overlayElem.getContext('2d');
    ctx.clearRect(0, 0, overlayElem.width, overlayElem.height);
    overlayElem.width = videoElem.videoWidth;
    overlayElem.height = videoElem.videoHeight;
}

function drawLine(x0, y0, x1, y1, color) {
    let ctx = overlayElem.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0 + 0.5, y0 + 0.5);
    ctx.lineTo(x1 + 0.5, y1 + 0.5);
    ctx.stroke();
}

function writeText(point, text){
    let ctx = overlayElem.getContext('2d');
    ctx.font = '18px arial';
    ctx.fillText(text, point.x, point.y);
}

function calculateIntersection(p1, p2, p3, p4) {
    
    // down part of intersection point formula
    let d1 = (p1.x - p2.x) * (p3.y - p4.y); // (x1 - x2) * (y3 - y4)
    let d2 = (p1.y - p2.y) * (p3.x - p4.x); // (y1 - y2) * (x3 - x4)
    let d  = (d1) - (d2);

    if(d == 0) {
    throw new Error('Number of intersection points is zero or infinity.');
}

    // upper part of intersection point formula
    let u1 = (p1.x * p2.y - p1.y * p2.x); // (x1 * y2 - y1 * x2)
    let u4 = (p3.x * p4.y - p3.y * p4.x); // (x3 * y4 - y3 * x4)
    
    let u2x = p3.x - p4.x; // (x3 - x4)
    let u3x = p1.x - p2.x; // (x1 - x2)
    let u2y = p3.y - p4.y; // (y3 - y4)
    let u3y = p1.y - p2.y; // (y1 - y2)

    // intersection point formula
    
    let px = (u1 * u2x - u3x * u4) / d;
    let py = (u1 * u2y - u3y * u4) / d;
    
    let p = { x: px, y: py };

    return p;
}

function analyze() {
    if (qrDetector == undefined){

    }
    else {
        mobileAnalyze();
    }
}

function mobileAnalyze(){
    qrDetector.detect(canvasElem).then(
        (response) => {
            cleanCanvas();
            response.forEach(element => {
                // console.log(element.cornerPoints)
                drawLine(
                    element.cornerPoints[0].x, element.cornerPoints[0].y,
                    element.cornerPoints[1].x, element.cornerPoints[1].y,
                    'red'
                );
                drawLine(
                    element.cornerPoints[1].x, element.cornerPoints[1].y,
                    element.cornerPoints[2].x, element.cornerPoints[2].y,
                    'red'
                );
                drawLine(
                    element.cornerPoints[2].x, element.cornerPoints[2].y,
                    element.cornerPoints[3].x, element.cornerPoints[3].y,
                    'red'
                );
                drawLine(
                    element.cornerPoints[3].x, element.cornerPoints[3].y,
                    element.cornerPoints[0].x, element.cornerPoints[0].y,
                    'red'
                );
                for (let i = 0; i < 4; i ++){
                    writeText(element.cornerPoints[i], "P"+i);
                }
            });
            if (response.length > 1){
                if (response[0].rawValue == "DR"){
                    drawOverlay(response[1], response[0]);
                } else {
                    drawOverlay(response[0], response[1]);
                }
            }
            if (response.length == 1) {
                drawOverlay_degrade(response[0], 4, 3);
            }
        }
    ).catch(
        (error) => { console.log(error); }
    );
}

function drawOverlay_degrade(qr, multipleW, multipleH)
{
    if (qr.rawValue == "UL") {
        /*
            |------- l1 ---------
            |
            |
            l2
            |
         */
        let p0 = qr.cornerPoints[0];
        let p1 = qr.cornerPoints[1];
        let p3 = qr.cornerPoints[3];
        l1dx = p1.x - p0.x;
        l1dy = p1.y - p0.y;
        l2dx = p3.x - p0.x;
        l2dy = p3.y - p0.y;
        ur = {
            x: p0.x + multipleW * l1dx,
            y: p0.y + multipleW * l1dy
        };
        dl = {
            x: p0.x + multipleH * l2dx,
            y: p0.y + multipleH * l2dy
        };
        dr = {
            x: p0.x + multipleH * l2dx + multipleW * l1dx,
            y: p0.y + multipleH * l2dy + multipleW * l1dy
        };
        let ctx = overlayElem.getContext('2d');
        ctx.save();
        ctx.fillStyle = '#FFC738';
        ctx.globalAlpha = 0.3
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(ur.x, ur.y);
        ctx.lineTo(dr.x, dr.y);
        ctx.lineTo(dl.x, dl.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function drawOverlay(qr1, qr2)
/*
    p0 -- p1 -------------------- ur
    | QR1 |                 |     |
    p3 ---+-----------------+------
    |     |                 |     |
    |     |                 |     |
    |-----+-----------------+---- q1
    |     |                 | QR2 |
    dl----+--------------- q3 -- q2
*/
{
    let p0 = qr1.cornerPoints[0];
    let p1 = qr1.cornerPoints[1];
    let p3 = qr1.cornerPoints[3];
    let q1 = qr2.cornerPoints[1];
    let q2 = qr2.cornerPoints[2];
    let q3 = qr2.cornerPoints[3];
    let ur = calculateIntersection(
        p0, p1, q2, q1
    );
    let dl = calculateIntersection(
        p0, p3, q2, q3
    );
    let ctx = overlayElem.getContext('2d');
    ctx.save();
    ctx.fillStyle = '#FFC738';
    ctx.globalAlpha = 0.3
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(ur.x, ur.y);
    ctx.lineTo(q2.x, q2.y);
    ctx.lineTo(dl.x, dl.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}