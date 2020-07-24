require('./config/config')

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB,(err,res)=>{
    if(err) throw new err;
    console.log("Conexión correcta")
})

app.listen(process.env.PORT,()=>{
    console.log("Escuchando",process.env.PORT)
})