//
//  createRoomViewController.swift
//  The Fences
//
//  Created by Andrew Su on 2022/2/5.
//  Copyright © 2022 Apple. All rights reserved.
//

import Foundation
import UIKit
import SwiftUI

class createRoomViewController: UIViewController {
  @IBOutlet weak var theContainer: UIView!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    let childView = UIHostingController(rootView: createRoomView(roomName: ""))
    addChild(childView)
    childView.view.frame = theContainer.bounds
    theContainer.addSubview(childView.view)
    
  }
}
