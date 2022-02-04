/* Global Variables */

let cameraStream = undefined;
let videoElemID = "rawCameraInput";
let videoElem = undefined;
let canvasElemID = "openCV-Output";
let canvasElem = undefined;
let overlayElemID = "drawOverlay";
let overlayElem = undefined;

let qrDetector = new window.BarcodeDetector({
    formats: ['qr_code']
});

/* OpenCV Variables */
let context = undefined;
let src = undefined;
let det = undefined;
let cap = undefined;
////////////////////

const FPS = 30;

// End 
function onOpenCVReady() {
    // Wait until OpenCV WASM Runtime is ready
    cv['onRuntimeInitialized'] = () => {
        console.info(cv.getBuildInformation());
        console.log("Open CV is Ready Now");
        initPhase1();
        setup_stream();
    }
}

function initPhase1() {
    videoElem = document.getElementById(videoElemID);
    canvasElem = document.getElementById(canvasElemID);
    overlayElem = document.getElementById("drawOverlay");
    // videoElem.addEventListener(
    //     "loadeddata", () => { startStream(); }
    // )
}

function initPhase2() {
    // There are some bug in OpenCV.js ... this is a work around
    // https://github.com/opencv/opencv/issues/19922
    videoElem.width = videoElem.videoWidth;
    videoElem.height = videoElem.videoHeight;

    context = canvasElem.getContext("2d");
    src = new cv.Mat(videoElem.videoHeight, videoElem.videoWidth, cv.CV_8UC4)
    det = new cv.Mat(videoElem.videoHeight, videoElem.videoWidth, cv.CV_8UC4)
    cap = new cv.VideoCapture(videoElem);
}

function setup_stream() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then (
                (stream) => {
                    cameraStream = stream;
                    videoElem.srcObject = cameraStream;
                    videoElem.play();
                }
            )
            .catch (
                (error) => { console.log(error); }
            )
    } else {
        console.warn("Client browser does not support WebRTC. Please use Chrome");
    }
}

function startStream() {
    initPhase2();
    mirrorStream();
}

function mirrorStream() {
    cap.read(src);
    cv.flip(src, det, 1);    // Flipcode = 1, flip across x-axis
    cv.imshow(canvasElemID, det);
    analyze();
    setTimeout(mirrorStream, 1000/FPS);
}

function terminate_stream() {
    cameraStream.getTracks().forEach(
        (track) => { track.stop(); }
    )
}
