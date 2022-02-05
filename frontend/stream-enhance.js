function execStream() {
    // Use OpenCV to manipulate stream from src
    cap.read(src);
    cv.cvtColor(src, det, cv.COLOR_RGB2GRAY);
    cv.imshow(canvasElemID, det);
    analyze();
    if (streamRunning){
        setTimeout(execStream, 1000/FPS);
    }
}
