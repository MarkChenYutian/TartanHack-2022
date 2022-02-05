# TartanHack 2020 - The FenceS

## How we Implement This Magical App?

### Web Application

For web application, we use the `WebRTC`, `OpenCV` and `WebAssembly` to create a chance to view experience for all mobile users without any need of installing application.

![How Web Pseudo-AR Work-26](https://markdown-img-1304853431.file.myqcloud.com/How Web Pseudo-AR Work-26.jpg)

Specifically, we use the QR Code not only to identify the current board's ID, but also calculate the perspective matrix of current frame and use it to draw AR overlay on browser.

`
