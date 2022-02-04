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
        console.info(cv.getBuildInformation());
        console.log("Open CV is Ready Now");
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
    execStream();
}

function execStream() {
    // Use OpenCV to manipulate stream from src
    cap.read(src);
    cv.flip(src, det, 1);           // Flip across x-axis
    cv.imshow(canvasElemID, det);   // Show flipped result on canvas
    setTimeout(execStream, 1000/FPS);
}