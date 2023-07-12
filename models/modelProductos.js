const mongoose = require("mongoose")

const Productos=mongoose.model("products",{
    id:Number,
    title:String,
    price:Number,
    photo:String,
    description:String,
    type:String
})
module.exports=Productos
