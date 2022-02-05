function logClicks(event) {
    let position = {
        onDOM: {x: event.clientX, y: event.clientY},
        onCanvas: {x: event.clientX * heightRatio, y: event.clientY * widthRatio}
    };
    if (ctx.getImageData(position.onCanvas.x, position.onCanvas.y, 1, 1).data[0] != 0){
        onClickBoard();
    }
}

function onClickBoard() {
    console.log("Click Board!");
    window.location.href="/frontend/editor/";
}


function scaleToFill(img){
    // get the scale
    let scale = Math.max(overlayElem.width / img.width, overlayElem.height / img.height);
    // get the top left position of the image
    let x = (overlayElem.width / 2) - (img.width / 2) * scale;
    let y = (overlayElem.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

