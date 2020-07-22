require('./config/config')

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());


app.get('/',function(req,res){
    res.json("Hola mundo")
})

app.post('/usuario',function(req,res){
    let body = req.body;

    res.json({
        persona:body
    });
})

app.put('/',function(req,res){
    res.json("put json")
})


app.delete('/',function(req,res){
    res.json("delete json mundo")
})


app.listen(process.env.PORT,()=>{
    console.log("Escuchando",process.env.PORT)
})