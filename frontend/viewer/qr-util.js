let qrDetector = window.BarcodeDetector ? new window.BarcodeDetector({
    formats: ['qr_code']
}): undefined;

function analyze() {
    if (qrDetector == undefined){

    }
    else {
        mobileAnalyze();
    }
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

function ptsApprox(p1, p2){
    return Math.abs(p1.x - p2.x) < ptsCompEpsilon && Math.abs(p1.y - p2.y < ptsCompEpsilon);
}

function mobileAnalyze(){
    qrDetector.detect(videoElem).then(
        (response) => {
            if (response.length == 0 && cleanLatencyCount < cleanLatencyMax){
                cleanLatencyCount ++;
                return;
            }
            
            
            if (response.length == 1 && response[0].rawValue == "UL") {
                if (prevRenders[0] != undefined && prevRenders[0][0].rawValue == "UL" && !isCleared &&
                    ptsApprox(response[0].cornerPoints[0], prevRenders[0][0].cornerPoints[0]) &&
                    ptsApprox(response[0].cornerPoints[1], prevRenders[0][0].cornerPoints[1])){
                        // console.log("UL stability enhancement intervene");
                        return;
                }   // Increase Stability of AR Image.
                cleanCanvas();
                cleanLatencyCount = 0;
                prevRenders[0] = response;
                renderPerspective(
                    response[0].cornerPoints[0],
                    response[0].cornerPoints[1],
                    response[0].cornerPoints[2],
                    response[0].cornerPoints[3],
                    100, 100
                );
                isCleared = false;
            } else if (response.length == 2){
                let qr1 = response[0].rawValue == "UL" ? response[0] : response[1];
                let qr2 = response[0].rawValue == "UL" ? response[1] : response[0];

                if (prevRenders[0] != undefined && prevRenders[0][1] != undefined && !isCleared &&
                    ptsApprox(qr1.cornerPoints[0], prevRenders[0][0].cornerPoints[0]) &&
                    ptsApprox(qr2.cornerPoints[2], prevRenders[0][1].cornerPoints[2])){
                        // console.log("Bilateral stability enhancement intervene");
                        return;
                }   // Increase Stability of AR Image.

                cleanCanvas();
                cleanLatencyCount = 0;
                prevRenders[0] = [qr1, qr2];
                renderPerspective(
                    qr1.cornerPoints[0],
                    calculateIntersection(
                        qr1.cornerPoints[0],
                        qr1.cornerPoints[1],
                        qr2.cornerPoints[2],
                        qr2.cornerPoints[1]
                    ),
                    qr2.cornerPoints[2],
                    calculateIntersection(
                        qr1.cornerPoints[0],
                        qr1.cornerPoints[3],
                        qr2.cornerPoints[2],
                        qr2.cornerPoints[3]
                    ),
                    600, 500
                );
                isCleared = false;
            } else if (cleanLatencyCount >= cleanLatencyMax) {
                cleanCanvas();
                isCleared = true;
                cleanLatencyCount = 0;
            }
        }
    ).catch(
        (error) => { console.error(error); }
    );
}

function updateBoardImg(imgPath) {
    boardElem.src = imgPath;
    isCleared = true;
}

function terminateStream() {
    cameraStream.getTracks().forEach(
        track => {track.stop();}
    );
    streamRunning = false;
    uiElem.style.background = "url(../../static/NoVideoInput.jpg)";
    uiElem.style.backgroundSize = "cover";
    uiElem.style.backgroundPosition = "center";
    document.getElementById("stop").style.display = "none";
    document.getElementById("start").style.display = "inline-block";
    cleanCanvas();
}