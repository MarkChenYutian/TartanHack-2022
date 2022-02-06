function logClicks(event) {
    let position = {
        onDOM: {x: event.clientX, y: event.clientY},
        onCanvas: {x: event.clientX / widthRatio, y: event.clientY / heightRatio}
    };
    console.log(position);
    writeText(position.onCanvas, "o");
    if (ctx.getImageData(position.onCanvas.x, position.onCanvas.y, 1, 1).data[0] != 0){
        onClickBoard();
    }
}

function onClickBoard() {
    console.log("Click Board!");
    window.location.href="/frontend/editor/";
}

