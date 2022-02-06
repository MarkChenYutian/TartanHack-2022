let points = [];
let registeredCall = undefined;

function getImageID() {
    let parsed = window.location.href.split("?");
    if (parsed.length != 2) {
        alert("Wrong Parameter");
    } else {
        document.getElementById("boardID").innerText = parsed[1];
    }
    return parsed[1];
}

function loadImage() {
    let boardID = getImageID();
    console.log(boardID);
    let image = new Image();
    image.onload = () => {
        let canvas = document.getElementById("main-img");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
    }
    image.src = "https://storage.googleapis.com/the-fence-340405.appspot.com/images/" + boardID + ".jpg";
}


function getColor() {
    return document.getElementById("colorSelector").value;
}

function getWidth() {
    return Math.max(1, document.getElementById("widthSelector").value);
}

function startDrawLine() {
    console.log("drawLine Function registered");
    registeredCall = {func: drawLine, args:2};
}

function startRectangle() {
    console.log("drawRectangle Function registered");
    registeredCall = {func: drawRect, args: 2};
}

function startPolygonPhase1() {
    console.log("Polygon tool phase 1 initiated");
    document.getElementById("vertex-query").style.display = "block";
}

function startPolygonPhase2() {
    console.log("Polygon tool phase 2 initiated");
    registeredCall = {
        func: drawPolygon,
        args: document.getElementById("vertexSelector").value
    };
    document.getElementById("vertex-query").style.display = "none";
}

function drawPolygon() {
    let ctx = document.getElementById("main-img").getContext("2d");
    ctx.lineWidth = getWidth();
    ctx.strokeStyle = getColor();
    ctx.beginPath();
    ctx.moveTo(points[0].x + 0.5, points[0].y + 0.5);
    for (let i = 0; i < points.length; i ++){
        ctx.lineTo(points[i].x + 0.5, points[i].y + 0.5);
    }
    ctx.lineTo(points[0].x + 0.5, points[0].y + 0.5);
    ctx.stroke();
}

function drawRect() {
    let ctx = document.getElementById("main-img").getContext("2d");
    ctx.lineWidth = getWidth();
    ctx.strokeStyle = getColor();
    ctx.beginPath();
    ctx.moveTo(points[0].x + 0.5, points[0].y + 0.5);
    ctx.lineTo(points[1].x + 0.5, points[0].y + 0.5);
    ctx.lineTo(points[1].x + 0.5, points[1].y + 0.5);
    ctx.lineTo(points[0].x + 0.5, points[1].y + 0.5);
    ctx.lineTo(points[0].x + 0.5, points[0].y + 0.5);
    ctx.stroke();
}

function drawLine() {
    let ctx = document.getElementById("main-img").getContext("2d");
    ctx.lineWidth = getWidth();
    ctx.strokeStyle = getColor();
    ctx.beginPath();
    ctx.moveTo(points[0].x + 0.5, points[0].y + 0.5);
    ctx.lineTo(points[1].x + 0.5, points[1].y + 0.5);
    ctx.stroke();
}

function writeClickPosition(event) {
    let canvas = document.getElementById("main-img");
    let widthRatio =  canvas.width / canvas.offsetWidth;
    let heightRatio = canvas.height / canvas.offsetHeight;
    let position = {
        onDOM: {x: event.clientX, y: event.clientY},
        onCanvas: {x: event.clientX * widthRatio, y: event.clientY * heightRatio}
    };
    console.log(position);
    if (registeredCall != undefined){
        points.push(position.onCanvas);    
    }
    if (registeredCall != undefined && (points.length) == registeredCall.args) {
        registeredCall.func();
        registeredCall = undefined;
        points = [];
    }
}

function mouseMove(e)
{
    let mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    console.log({
        x: mouseX, y: mouseY
    });
    /* do something with mouseX/mouseY */
}
