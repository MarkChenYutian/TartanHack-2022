// Global Variables
let streamRunning = false;

let cameraStream = undefined;
let videoElemID = "rawCameraInput";
let videoElem = undefined;
let overlayElemID = "drawOverlay";
let overlayElem = undefined;
let uiElem = undefined;

let boardElem = document.createElement("img");

/* OpenCV Variables */
let context = undefined;
let src = undefined;
let det = undefined;
let cap = undefined;

const FPS = 30;

// Stability Enhancement System
let cleanLatencyCount = 0;
const cleanLatencyMax = 15;
let prevRenders = [];
let ptsCompEpsilon = 2;
let isCleared = true;

// UI Control Variables
let widthRatio = undefined;
let heightRatio = undefined;
let noVideoSign = undefined;

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

function calculateRatio() {
    widthRatio = overlayElem.offsetWidth / overlayElem.width;
    heightRatio = overlayElem.offsetHeight / overlayElem.height;
}

function initPhase1() {
    videoElem = document.getElementById(videoElemID);
    overlayElem = document.getElementById("drawOverlay");
    uiElem = document.getElementById("ui-frame");
    boardElem.src = "../../static/test-mid.png";
    boardElem.style.display = "none";
    boardElem.id = "board-src";
    document.body.appendChild(boardElem);
    ctx = overlayElem.getContext('2d');
    videoElem.addEventListener(
        "loadeddata", startStream
    );
    window.addEventListener("resize", calculateRatio);
    uiElem.addEventListener("click", logClicks);
}

function initPhase2() {
    // We used to believe that OpenCV.js can help us detect QR Code ...
    //
    // BUT WE WERE WRONG. It simply just didn't work.
    //
    // There are some bug in OpenCV.js ... this is a work around
    // https://github.com/opencv/opencv/issues/19922
    // videoElem.width = videoElem.videoWidth;
    // videoElem.height = videoElem.videoHeight;

    // src = new cv.Mat(videoElem.videoHeight, videoElem.videoWidth, cv.CV_8UC4)
    // det = new cv.Mat(videoElem.videoHeight, videoElem.videoWidth, cv.CV_8UC4)
    // cap = new cv.VideoCapture(videoElem);
}

function isIOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

function setupStream() {
    if (isIOS()) {
        uiElem.style.background = "url(../../static/iosNotSupport.jpg)";
        uiElem.style.backgroundSize = "cover";
        uiElem.style.backgroundPosition = "center";
        document.getElementById("stop").style.display = "none";
        document.getElementById("start").style.display = "none";
        return;
    }
    errHandler("Start to setup webRTC Stream...");
    if (navigator.mediaDevices.getUserMedia) {
        errHandler("Navigator.mediaDevices.getUserMedia is detected.");
        navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment'} })
            .then (
                (stream) => {
                    uiElem.style.background = "none";
                    stream.getVideoTracks()[0].applyConstraints(
                        { width: 1280, height: 720 }
                    );
                    cameraStream = stream;
                    videoElem.srcObject = cameraStream;
                    videoElem.play();
                    streamRunning = true;
                    document.getElementById("start").style.display = "none";
                    document.getElementById("stop").style.display = "inline-block";
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
