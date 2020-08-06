require('./config/config')

const path = require('path');//DEFECTO
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));


//configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,(err,res)=>{
    if(err) throw  err;
    console.log("Conexión correcta")
})

app.listen(process.env.PORT,()=>{
    console.log("Escuchando",process.env.PORT)
})