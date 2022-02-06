//
//  createRoomView.swift
//  The Fences
//
//  Created by Andrew Su on 2022/2/5.
//  Copyright © 2022 Apple. All rights reserved.
//

import SwiftUI

struct createRoomView: View {
  @State var roomName: String

    var body: some View {
      VStack{
        Text("Please enter the name of room:")
        TextField("RoomName", text:$roomName)
        NavigationView{
          HStack{
            Spacer()
            
            NavigationLink {
              ViewController.ViewControllerRoomNameRepresentation(roomName: roomName)
            } label: {
              Text("Confirm")
            }

           
            Spacer()
            NavigationLink {
              ViewController.ViewControllerRoomNameRepresentation(roomName: "")
            } label: {
              Text("Cancel")
            }
            Spacer()
          }.padding()
        }
       
        

      }
      .padding()
    }
}

struct createRoomView_Previews: PreviewProvider {
    static var previews: some View {
      createRoomView(roomName: "")
    }
}
