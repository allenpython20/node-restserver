const express = require('express');
const Usuario =require('../models/usuario');
const bcrypt=require('bcrypt');
const _ =require('underscore');

const { verificaToken , verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();


app.get('/usuario',[verificaToken,verificaAdmin_Role], (req,res)=>{
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado:true },['nombre','estado'])//segundo parametro ,filtra los campos que se queire mostrar
        .skip(desde)
        .limit(limite)
        .exec((err,usuarios)=>{
            if(err) {
                return res.status(400).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            Usuario.count({estado:true},(err,conteo)=>{
                res.json({
                    ok:true,
                    usuarios,
                    conteo
                })
            })
        })
        
    
});

app.post('/usuario',[verificaToken,verificaAdmin_Role],function(req,res){
    let body = req.body;//obtener información del post

    
    let usuario = new Usuario({
        nombre : body.nombre,
        email:body.email,
        password : bcrypt.hashSync(body.password,10),
        role : body.role
    }); 

    usuario.save((err,usuarioDB)=>{
        if(err) {
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        res.json({
           ok : true,
           usuario : usuarioDB 
        })
    })
})

app.put('/usuario/:id',[verificaToken,verificaAdmin_Role],function(req,res){
    let id =req.params.id;/*este id debe ser igual al del parametro*/
    let body= _.pick(req.body,["nombre","email","img","role","estado"]);//pick regresa uan copia del objeto filtrando los valores que se le indican
    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true}, (err,usuarioDB)=>{//body->objeto que se quiere modificar,{new:true} ->nos devuelve el usuario ya modificado
        /*El segundo parametro es lo q se va usar para actualizar*/
        if(err) {
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario:usuarioDB
        })


    })
    
})


app.delete('/usuario/:id',[verificaToken,verificaAdmin_Role],function(req,res){
    let id =req.params.id;

     // Usuario.findByIdAndDelete(id,(err,usuarioEliminado)=>{
    //     if(err) {
    //         return res.status(400).json({/*400 ->ocurrio un error*/
    //             ok:false,
    //             err
    //         });
    //     }

    //     if(!usuarioEliminado){
    //         return res.status(400).json({
    //             ok:false,
    //             err:{
    //                 message:"Usuario no encontrado"
    //             }
    //         })
    //     }


    //     res.json({
    //         ok:true,
    //         usuario:usuarioEliminado
    //     })


    // })

    Usuario.findByIdAndUpdate(id,{estado:false},{new:true}, (err,usuarioDB)=>{//body->objeto que se quiere modificar,{new:true} ->nos devuelve el usuario ya modificado
    if(err) {
        return res.status(400).json({/*400 ->ocurrio un error*/
            ok:false,
            err
        });
    }

    res.json({
        ok:true,
        usuario:usuarioDB
    })


})






})


module.exports=app;