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

function getPerspectiveMatrix(p1, p2, p3, p4, bboxW, bboxH)
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
        bboxW, 0,
        bboxW, bboxH,
        0, bboxH
    ];
    let perspectiveMat = cv.matFromArray(4, 1, cv.CV_32FC2, perspectiveArray);
    let srcMat = cv.matFromArray(4, 1, cv.CV_32FC2, srcArray);
    T = cv.getPerspectiveTransform(srcMat, perspectiveMat);
    srcMat.delete(); perspectiveMat.delete();
    return T;
}

function renderPerspective(p0, p1, p2, p3, bboxW, bboxH) {
    let boardMat = cv.imread("board-src");
    T = getPerspectiveMatrix(p0, p1, p2, p3, bboxW, bboxH);
    let perspectiveMat = new cv.Mat(boardElem.height, boardElem.width, cv.CV_8UC4);
    let dsize = new cv.Size(overlayElem.width, overlayElem.height);
    cv.warpPerspective(
        boardMat, perspectiveMat, T, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar()
    );
    cv.imshow(overlayElemID, perspectiveMat);
    // drawQuadragon(
    //     overlayElem.getContext("2d"),
    //     p0, p1, p2, p3,
    //     "#0000FF"
    // );
    boardMat.delete(); T.delete(); perspectiveMat.delete();// dsize.delete();
    calculateRatio();
}
