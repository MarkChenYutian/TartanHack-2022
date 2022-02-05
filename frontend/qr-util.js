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

function mobileAnalyze(){
    qrDetector.detect(canvasElem).then(
        (response) => {
            cleanCanvas();
            // drawLine(0, 0, 1000, 1000, "#00FF00");
            // console.log(overlayElem);
            // response.forEach(element => {
            //     // console.log(element.cornerPoints)
            //     drawLine(
            //         element.cornerPoints[0].x, element.cornerPoints[0].y,
            //         element.cornerPoints[1].x, element.cornerPoints[1].y,
            //         'red'
            //     );
            //     drawLine(
            //         element.cornerPoints[1].x, element.cornerPoints[1].y,
            //         element.cornerPoints[2].x, element.cornerPoints[2].y,
            //         'red'
            //     );
            //     drawLine(
            //         element.cornerPoints[2].x, element.cornerPoints[2].y,
            //         element.cornerPoints[3].x, element.cornerPoints[3].y,
            //         'red'
            //     );
            //     drawLine(
            //         element.cornerPoints[3].x, element.cornerPoints[3].y,
            //         element.cornerPoints[0].x, element.cornerPoints[0].y,
            //         'red'
            //     );
            //     for (let i = 0; i < 4; i ++){
            //         writeText(element.cornerPoints[i], "P"+i);
            //     }
            // });
            if (response.length == 1) {
                renderPerspective(
                    response[0].cornerPoints[0],
                    response[0].cornerPoints[1],
                    response[0].cornerPoints[2],
                    response[0].cornerPoints[3]
                );
                // drawOverlay_degrade(response[0], 7, 5);
            }
        }
    ).catch(
        (error) => { console.error(error); }
    );
}

function terminateStream() {
    cameraStream.getTracks().forEach(
        track => {track.stop();}
    );
    streamRunning = false;
}