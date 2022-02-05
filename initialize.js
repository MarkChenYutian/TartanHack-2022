// Global Variables

let cameraStream = undefined;
let videoElemID = "rawCameraInput";
let videoElem = undefined;
let canvasElemID = "openCV-Output";
let canvasElem = undefined;
let overlayElemID = "drawOverlay";
let overlayElem = undefined;

/* OpenCV Variables */
let context = undefined;
let src = undefined;
let det = undefined;
let cap = undefined;

const FPS = 30;

//////////////////////

function onOpenCVReady() {
    // Wait until OpenCV WASM Runtime is ready
    cv['onRuntimeInitialized'] = () => {
        errHandler(cv.getBuildInformation());
        errHandler("Open CV is Ready Now");
        initPhase1();
        setupStream();
    }
}

function initPhase1() {
    videoElem = document.getElementById(videoElemID);
    canvasElem = document.getElementById(canvasElemID);
    overlayElem = document.getElementById("drawOverlay");
    videoElem.addEventListener(
        "loadeddata", startStream
    )
    errHandler("Exiting initPhase1");
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

function setupStream() {
    errHandler("Start to setup webRTC Stream...");
    if (navigator.mediaDevices.getUserMedia) {
        errHandler("Navigator.mediaDevices.getUserMedia is detected.");
        navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment'} })
            .then (
                (stream) => {
                    cameraStream = stream;
                    videoElem.srcObject = cameraStream;
                    videoElem.play();
                }
            )
            .catch (
                (error) => {
                    errHandler("Failed to getUserMedia");
                    errHandler(error);
                }
            )
    } else {
        errHandler("Try second option");
    }
}

function startStream() {
    initPhase2();
    execStream();
}

function execStream() {
    // Use OpenCV to manipulate stream from src
    cap.read(src);
    // cv.flip(src, det, 1);           // Flip across x-axis
    // cv.imshow(canvasElemID, det);   // Show flipped result on canvas
    cv.imshow(canvasElemID, src);
    analyze();
    setTimeout(execStream, 1000/FPS);
}