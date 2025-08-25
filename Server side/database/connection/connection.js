import mongoose from 'mongoose'

export const connection = ()=>{
    mongoose.connect("mongodb://localhost:27017/gallery").then(()=>{
        console.log("Connected to MongoDB")
    }).catch((err)=>{
        console.log(err)
    })  
}