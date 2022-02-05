function writeOutput(text){
    document.getElementById("console-output").innerText += "\n\n";
    document.getElementById("console-output").innerText += text;
}

function setwebcam()
{
	console.log("Start setwebcam()");
	var options = true;
	if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
	{
		try{
			navigator.mediaDevices.enumerateDevices()
			.then(function(devices) {
			  devices.forEach(function(device) {
				if (device.kind === 'videoinput') {
				  if(device.label.toLowerCase().search("back") > -1)
					options={'deviceId': {'exact':device.deviceId}, 'facingMode':'environment'} ;
				}
				console.log(device.kind + ": " + device.label +" id = " + device.deviceId);
			  });
			  setwebcam2(options);
			});
		}
		catch(e)
		{
			console.log(e);
		}
	}
	else{
		console.log("no navigator.mediaDevices.enumerateDevices" );
		setwebcam2(options);
	}
	
}

function setwebcam2(options)
{
	console.log(options);
	// document.getElementById("result").innerHTML="- scanning -";
    // if(stype==1)
    // {
    //     setTimeout(captureToCanvas, 500);    
    //     return;
    // }
    var n=navigator;
    // document.getElementById("outdiv").innerHTML = vidhtml;
    // v=document.getElementById("v");


    if(n.mediaDevices != undefined && n.mediaDevices.getUserMedia)
    {
        n.mediaDevices.getUserMedia({video: options, audio: false}).
            then(function(stream){
                console.log("Getstream success 1");
                success(stream);
            }).catch(function(error){
                error(error)
            });
    }
    else if(n.getUserMedia)
	{
        console.log("Getstream success 2");
		webkit=true;
        n.getUserMedia({video: options, audio: false}, success, error);
	}
    else if(n.webkitGetUserMedia)
    {
        console.log("Getstream success 3");
        webkit=true;
        n.webkitGetUserMedia({video:options, audio: false}, success, error);
    }
    console.log("exit cases");
    document.getElementById("qrimg").style.opacity=0.2;
    document.getElementById("webcamimg").style.opacity=1.0;

    stype=1;
    setTimeout(captureToCanvas, 500);
}