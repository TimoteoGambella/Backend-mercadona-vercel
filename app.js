const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const password=process.env.PASSWORDMONGO
const dbname="MercadonaData"

const uri = `mongodb+srv://timoteogambella:${password}@cluster0.njkyiaj.mongodb.net/${dbname}?retryWrites=true&w=majority`

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
app.use(cors())

mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
const connection= mongoose.connection
const Productos=require("./models/models")
const Usuarios=require("./models/models")

connection.once("open", ()=>{
    console.log("Conexion a la BD exitosa...")
})
connection.on("error", (error,res)=>{
    console.log("Error en la conexion a la BD:",error)
})


const typesOfProducts=require("./models/typesOfProducts")

const descryptId=require("./services/crypto")

app.post("/api/getByType",(req,res)=>{
    Productos.find({type:req.body.type}
        .then(doc=>{
            if(doc.length!==0){
                res.json({response:"success",data:doc,message:"Productos encontrados"})
            }else{
                res.json({response:"failed",data:doc,message:"Productos no encontrados"}) 
            }
        })
        .catch(err=>{
            res.json({response:"failed",data:doc})
        })
    )
})
app.post("/api/getAllUsers",(req,res)=>{
    Usuarios.find({}).then(doc=>{
        res.json({response:"success",data:doc})
    })
    .catch(err=>{
        res.json({response:"failed",data:doc,message:"Error Base de Datos"})
    })
})
app.post("/api/getAllTypes",(req,res)=>{
    res.json({response:"success",data:typesOfProducts})
})

app.post("/api/getUser",(req,res)=>{

    Usuarios.find({_id:userId}
        .then(doc=>{
            if(doc.length!==0){
                res.json({response:"success",data:doc,message:"Usuario encontrado"})
            }else{
                res.json({response:"failed",data:doc,message:"Usuario no encontrado"}) 
            }
        })
        .catch(err=>{
            res.json({response:"failed",data:doc})
        })
    )
})
app.post("/api/getUserByMail",(req,res)=>{

    Usuarios.find({mail:req.body.mail}
        .then(doc=>{
            if(doc.length!==0){
                res.json({response:"success",data:doc,message:"Usuario encontrado"})
            }else{
                res.json({response:"failed",data:doc,message:"Usuario no encontrado"}) 
            }
        })
        .catch(err=>{
            res.json({response:"failed",data:doc})
        })
    )
})

app.post("/api/login", (req,res)=>{

    Usuarios.find({
        mail:req.body.mail,
        password:req.body.password
    }).then(doc=>{
        if(doc.length!==0){
            res.json({response:"success",data:doc,message:"Usuario encontrado"})
        }else{
            res.json({response:"failed",data:doc,message:"Usuario no encontrado"}) 
        }
    })
    .catch(err=>{
        res.json({response:"failed",data:doc})
    })
})

app.post("/api/register", (req,res)=>{
    if(req.body.mail && req.body.password && req.body.username){
        Usuarios.find({
            mail:req.body.mail,
        }).then(doc=>{
            if(doc.length!==0){
                res.json({response:"failed",data:{},message:"Mail ya registrado"})
            }else{
                const user = new Usuarios({
                    mail:req.body.mail,
                    username:req.body.username,
                    password:req.body.password,
                    favs:[],
                    cart:[]
                })
                user.save().then(doc=>{
                    res.json({response:"success",data:doc,message:"Usuario creado"})
                })
                .catch(err=>{
                    res.status(400).json({response:"failed",data:doc,message:"Ocurrió un error"})
                })
            }
        })
        .catch(err=>{
            res.json({response:"failed",data:doc,message:"Error Base de Datos"})
        })
    }else{
        res.json({response:"failed",data:{},message:"Parametros incorrectos"})
    }
})

app.post("/api/favs", (req,res)=>{
    let newFavs=req.body.favs

    let userId = descryptId(req.body.id)

    if(!Array.isArray(newFavs)){
        res.json({response:"failed",data:{},message:"Favoritos mal enviados"})
    }else{
        const update = {$set:{favs:newFavs}}
        Usuarios.findByIdAndUpdate(userId, update)
            .then(doc=>{
                res.json({response:"success",data:doc,message:"Favoritos actualizados"})
            })
            .catch(err=>{
                res.json({response:"failed",data:doc,message:"Favoritos no actualizados"})
            })
    }
})
app.post("/api/cart", (req,res)=>{
    let newCart=req.body.cart

    let userId = descryptId(req.body.id)

    if(!Array.isArray(newCart)){
        res.json({response:"failed",data:{},message:"Carrito mal enviado"})
    }else{
        const update = {$set:{cart:newCart}}
        Usuarios.findByIdAndUpdate(userId, update)
            .then(doc=>{
                res.json({response:"success",data:doc,message:"Carrito actualizado"})
            })
            .catch(err=>{
                res.json({response:"failed",data:doc,message:"Carrito no actualizado"})
            })
    }
})

app.post("/api/orderBy", (req,res)=>{
    let param=req.body.param
    if(param==="nameAZ" || param==="nameZA" || param==="priceMax" || param==="priceMin"){
        Productos.find({type:req.body.type}
            .then(doc=>{
                if(doc.length!==0){
                    res.json({response:"success",data:doc,message:"Productos encontrados"})
                }else{
                    res.json({response:"failed",data:doc,message:"Productos no encontrados"}) 
                }
            })
            .catch(err=>{
                res.json({response:"failed",data:doc})
            })
        ).sort(
            param==="nameAZ"?{name:1}:
            param==="nameZA"?{name:-1}:
            param==="priceMax"?{price:1}:
            param==="priceMin"&&{price:-1}
        )
    }
})

app.post("/api/getDays", async(req,res)=>{
    const days=await getweek(new Date())
    res.json({response:"success",data:days,message:"Dias próximos"})
})

app.listen(3000, ()=>{
    console.log("Servidor listo")
})