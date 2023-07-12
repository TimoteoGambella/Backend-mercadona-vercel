const mongoose = require("mongoose")

const Usuarios=mongoose.model("users",{
    mail:String,
    username:String,
    password:String,
    favs:Array,
    cart:Array
})

module.exports=Usuarios