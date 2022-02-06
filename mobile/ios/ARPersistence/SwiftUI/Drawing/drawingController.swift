//
//  drawingController.swift
//  The Fences
//
//  Created by Andrew Su on 2022/2/5.
//  Copyright © 2022 Apple. All rights reserved.
//
import SwiftUI
import PencilKit

class DrawingCanvasViewController: UIViewController {
lazy var canvas: PKCanvasView = {
let view = PKCanvasView()
view.drawingPolicy = .anyInput
view.minimumZoomScale = 1
view.maximumZoomScale = 1        view.translatesAutoresizingMaskIntoConstraints = false
return view    }()
lazy var toolPicker: PKToolPicker = {
let toolPicker = PKToolPicker()
toolPicker.addObserver(self)
return toolPicker    }()
var drawingData = Data()
var drawingChanged: (Data) -> Void = {_ in}
override func viewDidLoad() {
super.viewDidLoad()
view.addSubview(canvas)
NSLayoutConstraint.activate([                                        canvas.leadingAnchor.constraint(equalTo: view.leadingAnchor),                                        canvas.trailingAnchor.constraint(equalTo: view.trailingAnchor),                                        canvas.topAnchor.constraint(equalTo: view.topAnchor),                                        canvas.bottomAnchor.constraint(equalTo: view.bottomAnchor)])        toolPicker.setVisible(true, forFirstResponder: canvas)        toolPicker.addObserver(canvas)
canvas.delegate = self
canvas.becomeFirstResponder()
if let drawing = try? PKDrawing(data: drawingData){            canvas.drawing = drawing
}
}
}

