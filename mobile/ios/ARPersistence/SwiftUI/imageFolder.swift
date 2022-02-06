//
//  imageFolder.swift
//  The Fences
//
//  Created by Andrew Su on 2022/2/5.
//  Copyright © 2022 Apple. All rights reserved.
//
import SwiftUI

struct imageFolderView: View {
    var body: some View {
        ZStack{
            Color("Top")
            VStack{
                TopView()
                BottomView()
            }
        }
    }
}

struct TopView: View {
    var body: some View{
        ZStack{
            Color("Top")
                .edgesIgnoringSafeArea(.all)
            HStack{
                RegularText(text: "Recent", color: "TextColor")
            }
            HStack{
                Button(action: {}){Image(systemName:"chevron.left")
                    CancelText(text: "Albums")
                }.padding(.leading)
                Spacer()
            }.padding(.leading)
        }.frame(width: 375, height: 42)
    }
}

struct BottomView: View {
    var body: some View{
        ZStack{
            ScrollView{
                LazyVGrid(columns: [
                    .init(),
                    .init(),
                    .init()
                ]){
                    ForEach((1...100), id: \.self){index in
                        Image(systemName: "photo")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 80, height: 60, alignment: .topLeading)
                            .imageScale(.large)
                    }.padding()
                }
            }
        }
    }
}

struct RegularText: View {
    var text: String
    var color: String
    
    var body: some View {
        Text(text)
            .kerning(-0.408)
            .font(.callout)
            .fontWeight(.regular)
            .foregroundColor(Color(color))
            .multilineTextAlignment(.center)
            .frame(width: 59, height: 22)
    }
}

struct CancelText: View {
    var text: String
    
    var body: some View {
        Text(text)
            .kerning(-0.408)
            .font(.subheadline)
            .fontWeight(.regular)
            .foregroundColor(Color("Cancel"))
    }
}


struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        imageFolderView()
    }
}
