//
//  ContentView.swift
//  Drawing Pencil Kit
//
//  Created by Haaris Iqubal on 5/7/21.
//

import SwiftUI
import CoreData

import PencilKit
struct drawContentView: View {
    @Environment(\.managedObjectContext) private var viewContext
  @Environment(\.presentationMode) var presentationMode
    @FetchRequest(entity: Drawing.entity(), sortDescriptors: []) var drawings: FetchedResults<Drawing>
    
    @State private var showSheet = false
//  @Binding var uiImage: UIImage?

    var body: some View {
        NavigationView{
            VStack{
                List {
                    ForEach(drawings){ drawing in
                      let defaultData = Data()
                      let data = drawing.canvasData ?? defaultData
                        
//                        let uiImage = UIImage(data: data)
                     
//                      let uiImage = UIImage(data:  PKDrawing(data: data))
                      
//                      NavigationLink(destination: DrawingView(id: drawing.id, data: drawing.canvasData, title: drawing.title), label: { Text(drawing.title ?? "Untitled")})
                        if data == defaultData {
                          NavigationLink(destination: DrawingView(id: drawing.id, data: drawing.canvasData, title: drawing.title), label: { Text(drawing.title ?? "Untitled")})
                        }
                      else{
//                        var PKdata = Data()
                        let PKdata = try? PKDrawing(data: data)
//                        let PKdata = try PKDrawing(data: data)
                        let image = PKdata!.image(from: PKdata!.bounds , scale: 1.0)
                        NavigationLink(destination: ViewController.ViewControllerRepresentation(uiImage:image), label: { Text(drawing.title ?? "Untitled")})
                      }
                        
                        
                      
                    }
                    .onDelete(perform: deleteItem)
                    
                    Button(action: {
                        self.showSheet.toggle()
                    }, label: {
                        HStack{
                            Image(systemName: "plus")
                            Text("Add Canvas")
                        }
                    })
                    .foregroundColor(.blue)
                    .sheet(isPresented: $showSheet, content: {
                        AddNewCanvasView().environment(\.managedObjectContext, viewContext)
                    })
                }
                .navigationTitle(Text("Drawing"))
                .toolbar {
                    EditButton()
                }
                
                
            }
            VStack{
                Image(systemName: "scribble.variable")
                    .font(.largeTitle)
                Text("No canvas has been selected")
                    .font(.title)
            }
        }
        .navigationViewStyle(DoubleColumnNavigationViewStyle())
        
    }
    
    func deleteItem(at offset: IndexSet) {
        for index in offset{
            let itemToDelete = drawings[index]
            viewContext.delete(itemToDelete)
            do{
                try viewContext.save()
            }
            catch{
                print(error)
            }
        }
    }

}


//struct drawContentView_Previews: PreviewProvider {
//    static var previews: some View {
//        drawContentView().environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
//    }
//}
