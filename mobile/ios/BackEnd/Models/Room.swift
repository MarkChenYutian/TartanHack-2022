//
//  Room.swift
//  The Fences
//
//  Created by Andrew Su on 2022/2/6.
//  Copyright © 2022 Apple. All rights reserved.
//

import Foundation
import FirebaseFirestoreSwift

struct Post: Codable, Identifiable {
  @DocumentID var id: String?
  var roomName: String
  var createdAt: Date
  var anchorImg : [String: String]
  var roomARDataURL: String
//  var otherComment: [OtherComment]

//  init(id: UUID? = nil, caption: String, createdAt: Date = Date(), createdBy: String = currentUser?.id ?? "",otherComment:[OtherComment] = []) {
//    self.id = id
//    self.createdByUser = createdBy
//    self.createdAt = createdAt
//    self.caption = caption
//    self.otherComment = otherComment
//
//  }
//
  
}

