const express = require('express');



const { verificaToken  } = require('../middlewares/autenticacion');
const app = express();

const Categoria =require('../models/categoria');

app.get('/categoria',verificaToken, (req,res)=>{
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})//segundo parametro ,filtra los campos que se queire mostrar
        .skip(desde)
        .limit(limite)
        .populate('usuario','nombre email')//hace referencia al campo del modelo
        .exec((err,categorias)=>{
            if(err) {
                return res.status(400).json({/*400 ->ocurrio un error*/
                    ok:false,
                    err
                });
            }

            Categoria.count({},(err,conteo)=>{
                res.json({
                    ok:true,
                    categorias,
                    conteo
                })
            })
        })
        
    
});

app.get('/categoria/:id',verificaToken,(req,res)=>{
    let id =req.params.id;/*este id debe ser igual al del parametro*/;

    Categoria.findById(id)
        .populate('usuario')
        .exec((err,categoriaDB)=>{
        /*El segundo parametro es lo q se va usar para actualizar*/
        if(err) {
            return res.status(500).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })


    })
    
})

app.post('/categoria',verificaToken,function(req,res){
    let body = req.body;//obtener información del post

    
    let categoria = new Categoria({
        descripcion : body.descripcion,
        usuario : req.usuario._id
    }); 

    categoria.save((err,categoriaDB)=>{
        if(err) {
            return res.status(500).json({/*500 ->ocurrio un error de bbbdd*/
                ok:false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }



        res.json({
           ok : true,
           categoria : categoriaDB 
        })
    })
})



app.put('/categoria/:id',verificaToken,(req,res)=>{
    let id =req.params.id;/*este id debe ser igual al del parametro*/;
    let categoriaMod = {
        descripcion : req.body.descripcion
    }
    Categoria.findByIdAndUpdate(id,categoriaMod,{new:true,runValidators:true}, (err,categoriaDB)=>{
        /*El segundo parametro es lo q se va usar para actualizar*/
        if(err) {
            return res.status(500).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        if(!categoriaDB) {
            return res.status(400).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })


    })
    
})

app.delete('/categoria/:id',verificaToken,function(req,res){
    let id =req.params.id;

    Categoria.findByIdAndDelete(id,(err,categoriaEliminada)=>{
        if(err) {
            return res.status(500).json({/*400 ->ocurrio un error*/
                ok:false,
                err
            });
        }

        if(!categoriaEliminada){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"Categoria no encontrado"
                }
            })
        }

        res.json({
            ok:true,
            categoria:categoriaEliminada
        })


    })

})


module.exports=app;