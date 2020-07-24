const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');
const app = express();

app.post('/login',(req,res)=>{
    
    let body = req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err) {
            return res.status(500).json({/*500 ->ocurrio un error en el servidor*/
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err:"(usuario) no encontrado"
            });
            
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password)){/*comprobar la contraseña*/
            
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err:"(contraseña) incorrecta"
            });
            
        }
        
        let token = jwt.sign({
            usuario:usuarioDB//PAYLOAD:DATA
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN });


        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        })
    })

})








module.exports=app;