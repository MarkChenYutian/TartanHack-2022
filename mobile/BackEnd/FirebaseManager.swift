//
//  Post.swift
//  The Fences
//
//  Created by Andrew Su on 2022/2/6.
//  Copyright © 2022 Apple. All rights reserved.
//

import Foundation
import Firebase

class FirebaseManager: NSObject {
 
  let storage: Storage
  let firestore: Firestore
  

  static let shared = FirebaseManager()
  
  override init() {
    FirebaseApp.configure()
    

    self.storage = Storage.storage()
    self.firestore = Firestore.firestore()
    
    super.init()
  }
}
