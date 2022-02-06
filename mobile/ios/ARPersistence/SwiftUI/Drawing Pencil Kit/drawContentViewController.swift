//
//  drawContentViewController.swift
//  The Fences
//
//  Created by Andrew Su on 2022/2/5.
//  Copyright © 2022 Apple. All rights reserved.
//

import Foundation
import UIKit
import SwiftUI

class drawContentViewController: UIViewController {

  @IBOutlet weak var theContainer: UIView!
//  @IBOutlet weak var theContainer: UIView!
  @State var uiImage: UIImage?
  override func viewDidLoad() {
    super.viewDidLoad()
    let persistenceController = PersistenceController.shared
    let childView = UIHostingController(rootView: drawContentView().environment(\.managedObjectContext, persistenceController.container.viewContext))
    addChild(childView)
    childView.view.frame = theContainer.bounds
    theContainer.addSubview(childView.view)
    
  }
}
