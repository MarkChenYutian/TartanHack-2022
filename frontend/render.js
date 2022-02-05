/// GLOBAL VARIABLES

let fillColor = "#FFC738";
let opacity = 0.9;
let ctx = undefined;
let cache = {};

///


function cleanCanvas() {
    ctx.clearRect(0, 0, overlayElem.width, overlayElem.height);
    overlayElem.width = videoElem.videoWidth;
    overlayElem.height = videoElem.videoHeight;
}

function drawLine(x0, y0, x1, y1, color) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0 + 0.5, y0 + 0.5);
    ctx.lineTo(x1 + 0.5, y1 + 0.5);
    ctx.stroke();
}

function drawQuadragon(context, p1, p2, p3, p4, color) {
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(p1.x + 0.5, p1.y + 0.5);
    context.lineTo(p2.x + 0.5, p2.y + 0.5);
    context.lineTo(p3.x + 0.5, p3.y + 0.5);
    context.lineTo(p4.x + 0.5, p4.y + 0.5);
    context.lineTo(p1.x + 0.5, p1.y + 0.5);
    context.stroke();
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

function getPerspectiveMatrix(p1, p2, p3, p4)
// Originally p1, p2, p3, p4 in QR detected.
{
    let corner1 = new cv.Point(p1.x, p1.y);
    let corner2 = new cv.Point(p2.x, p2.y);
    let corner3 = new cv.Point(p3.x, p3.y);
    let corner4 = new cv.Point(p4.x, p4.y);
    let perspectiveArray = [
        corner1.x, corner1.y, 
        corner2.x, corner2.y,
        corner3.x, corner3.y,
        corner4.x, corner4.y
    ];
    let srcArray = [
        0, 0,
        50, 0,
        50, 50,
        0, 50
    ];
    let perspectiveMat = cv.matFromArray(4, 1, cv.CV_32FC2, perspectiveArray);
    let srcMat = cv.matFromArray(4, 1, cv.CV_32FC2, srcArray);
    // corner1.delete(); corner2.delete(); corner3.delete(); corner4.delete();
    T = cv.getPerspectiveTransform(srcMat, perspectiveMat);
    srcMat.delete(); perspectiveMat.delete();
    return T;
}

function renderPerspective(p0, p1, p2, p3) {
    // drawLine(0, 0, 1000, 1000, "#00FF00");
    let boardMat = cv.imread("board-src");
    T = getPerspectiveMatrix(p0, p1, p2, p3);
    let perspectiveMat = new cv.Mat(boardElem.height, boardElem.width, cv.CV_8UC4);
    // let dsize = new cv.Size(boardElem.width, boardElem.height);
    let dsize = new cv.Size(overlayElem.width, overlayElem.height);
    cv.warpPerspective(
        boardMat, perspectiveMat, T, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar()
    );
    cv.imshow(overlayElemID, perspectiveMat);
    // cv.imshow("openCV-debug", perspectiveMat);
    // drawQuadragon(
    //     overlayElem.getContext("2d"),
    //     {x: 0, y: 0},
    //     {x: 500, y: 0},
    //     {x: 500, y: 500},
    //     {x: 0, y: 500},
    //     "#00FF00"
    // );
    drawQuadragon(
        overlayElem.getContext("2d"),
        p0, p1, p2, p3,
        "#0000FF"
    );
    boardMat.delete(); T.delete(); perspectiveMat.delete();// dsize.delete();
}

// function drawOverlay(qr1, qr2)
// /*
//     p0 -- p1 -------------------- ur
//     | QR1 |                 |     |
//     p3 ---+-----------------+------
//     |     |                 |     |
//     |     |                 |     |
//     |-----+-----------------+---- q1
//     |     |                 | QR2 |
//     dl----+--------------- q3 -- q2
// */
// {
//     let p0 = qr1.cornerPoints[0];
//     let p1 = qr1.cornerPoints[1];
//     let p3 = qr1.cornerPoints[3];
//     let q1 = qr2.cornerPoints[1];
//     let q2 = qr2.cornerPoints[2];
//     let q3 = qr2.cornerPoints[3];
//     let ur = calculateIntersection(
//         p0, p1, q2, q1
//     );
//     let dl = calculateIntersection(
//         p0, p3, q2, q3
//     );
//     ctx.save();
//     ctx.fillStyle = fillColor;
//     ctx.globalAlpha = opacity
//     ctx.beginPath();
//     ctx.moveTo(p0.x, p0.y);
//     ctx.lineTo(ur.x, ur.y);
//     ctx.lineTo(q2.x, q2.y);
//     ctx.lineTo(dl.x, dl.y);
//     ctx.closePath();
//     ctx.fill();
//     ctx.restore();
// }

// function drawOverlay_degrade(qr, multipleW, multipleH)
// {
//     let p0 = qr.cornerPoints[0];
//     let p1 = qr.cornerPoints[1];
//     let p2 = qr.cornerPoints[2];
//     let p3 = qr.cornerPoints[3];
//     if (qr.rawValue == "UL") {
//         /*
//             |------- l1 ---------
//             |
//             |
//             l2
//             |
//         */       
//         l1dx = p1.x - p0.x;
//         l1dy = p1.y - p0.y;
//         l2dx = p3.x - p0.x;
//         l2dy = p3.y - p0.y;
//         ur = {
//             x: p0.x + multipleW * l1dx,
//             y: p0.y + multipleW * l1dy
//         };
//         dl = {
//             x: p0.x + multipleH * l2dx,
//             y: p0.y + multipleH * l2dy
//         };
//         dr = {
//             x: p0.x + multipleH * l2dx + multipleW * l1dx,
//             y: p0.y + multipleH * l2dy + multipleW * l1dy
//         };
        
//         ctx.save();
//         ctx.fillStyle = fillColor;
//         ctx.globalAlpha = opacity;
//         ctx.beginPath();
//         ctx.moveTo(p0.x, p0.y);
//         ctx.lineTo(ur.x, ur.y);
//         ctx.lineTo(dr.x, dr.y);
//         ctx.lineTo(dl.x, dl.y);
//         ctx.closePath();
//         ctx.fill();
//         ctx.restore();
//     } else if (qr.rawValue == "DR") {
//         /*
//                             |
//                             |
//                             l1
//                             |
//         --------- l2 -------p2
//         */
//         l1dx = p1.x - p2.x;
//         l1dy = p1.y - p2.y;
//         l2dx = p3.x - p2.x;
//         l2dy = p3.y - p2.y;
//         ur = {
//             x: p2.x + multipleH * l1dx,
//             y: p2.y + multipleH * l1dy
//         };
//         dl = {
//             x: p2.x + multipleW * l2dx,
//             y: p2.y + multipleW * l2dy
//         };
//         dr = {
//             x: p2.x + multipleW * l2dx + multipleH * l1dx,
//             y: p2.y + multipleW * l2dy + multipleH * l1dy
//         };
//         ctx.save();
//         ctx.fillStyle = fillColor;
//         ctx.globalAlpha = opacity;
//         ctx.beginPath();
//         ctx.moveTo(p2.x, p2.y);
//         ctx.lineTo(ur.x, ur.y);
//         ctx.lineTo(dr.x, dr.y);
//         ctx.lineTo(dl.x, dl.y);
//         ctx.closePath();
//         ctx.fill();
//         ctx.restore();
//     }
// }

