const mongoose = require("mongoose")

const Productos=mongoose.model("products",{
    id:Number,
    title:String,
    price:Number,
    photo:String,
    description:String,
    type:String
})
const Usuarios=mongoose.model("users",{
    mail:String,
    username:String,
    password:String,
    favs:Array,
    cart:Array
})

module.exports=Productos
module.exports=Usuarios