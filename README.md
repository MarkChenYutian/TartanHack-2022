# TartanHack 2020 - The Fences

## How we Implement This Magical App?

### Web Application

For web application, we use the `WebRTC`, `OpenCV` and `WebAssembly` to create a chance to view experience for all mobile users without any need of installing application.

![How Web Pseudo-AR Work-26](https://user-images.githubusercontent.com/47029019/152642888-fb398d92-547f-4f08-bec2-e01ef6b10b02.jpg)

Specifically, we use the QR Code not only to identify the current board's ID, but also calculate the perspective matrix of current frame and use it to draw AR overlay on browser.
