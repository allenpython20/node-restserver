const express = require('express');
const Producto =require('../models/producto');


const { verificaToken  } = require('../middlewares/autenticacion');
const app = express();

app.get('/producto',verificaToken,(req,res)=>{

    Producto.find({})
        .populate('categoria','descripcion')
        .populate('usuario','nombre')
        .exec((err,productosDB)=>{
            if(err) {
                return res.status(500).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            if(!productosDB) {
                return res.status(400).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                productos:productosDB
            })
        })
    
})

app.get('/producto/buscar/:termino',verificaToken,(req,res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');//crea una expresion  regular,la i es no sensitive case

    Producto.find({nombre:regex})
        .populate('categoria','descripcion')
        .populate('usuario','nombre')
        .exec((err,productosDB)=>{
            if(err) {
                return res.status(500).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            if(!productosDB) {
                return res.status(400).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                productos:productosDB
            })
        })
    
})

app.get('/producto/:id',verificaToken,(req,res)=>{

    let id =req.params.id;/*este id debe ser igual al del parametro*/;

    Producto.findById(id)
        .populate('categoria','descripcion')
        .populate('usuario','nombre')
        .exec((err,productoDB)=>{
            if(err) {
                return res.status(500).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            if(!productoDB) {
                return res.status(400).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                producto:productoDB
            })
        })
    
})

app.post('/producto',verificaToken,(req,res)=>{
    let body = req.body;//obtener información del post

    
    let producto = new Producto({
        usuario : req.usuario._id,
        nombre : body.nombre,
        precioUni:body.precioUni,
        descripcion : body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }); 

    producto.save((err,productoDB)=>{
        if(err) {
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        res.status(201).json({//201 se guardo un registro
           ok : true,
           producto : productoDB 
        })
    })


});

app.put('/producto/:id',verificaToken,(req,res)=>{

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id,(err,productoDB)=>{
        if(err) {
            return res.status(500).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        if(!productoDB) {
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err:{
                    message : "El producto no existe"
                }
            });
        }

        productoDB.nombre = body.nombre,
        productoDB.precioUni = body.precioUni,
        productoDB.categoria = body.categoria,
        productoDB.disponible = body.disponible,
        productoDB.descripcion = body.descripcion,

        productoDB.save((err,productoGuardado)=>{
            if(err) {
                return res.status(500).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                producto:productoGuardado
            })
        })

    })
});

module.exports = app;