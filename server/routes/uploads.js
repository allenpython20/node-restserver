const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


app.use(fileUpload());

app.put('/upload/:tipo/:id',function(req,res){

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400)
            .json({
                ok:false,
                err:{
                    message : "No se ha seleccionado ningún archivo"
                }
            })
    }

    //Valida tipo
    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message : "Los tipos permitidos son " + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;//archivo es el nombre del input del form
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length-1];

    //Extensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf(extension.toLowerCase())<0){//extension no esta en el arrego extValidas
        return res.status(400).json({
            ok:false,
            message:'El archivo debe tener las extensiones ' + extensionesValidas.join(', ')
        })
    }

    //cambiar nombre archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`,function (err){//mv->mover
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(tipo==="usuarios"){
            imagenUsuario(id,res,nombreArchivo)
        }else{
            imagenProducto(id,res,nombreArchivo)
        }
        
    });
})

function imagenUsuario(id,res,nombreArchivo){
    
    Usuario.findById(id,(err,usuarioDB)=>{

        if(err){
            borrarArchivo(nombreArchivo,"usuarios")
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo,"usuarios")
            return res.status(400).json({
                ok:false,
                message : 'Usuairo no encontrado'
            })
        }

        
        borrarArchivo(usuarioDB.img,"usuarios");
        
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario:usuarioGuardado
            })
        })
    });
}

function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id,(err,productoDB)=>{

        if(err){
            borrarArchivo(nombreArchivo,"productos")
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){
            borrarArchivo(nombreArchivo,"productos")
            return res.status(400).json({
                ok:false,
                message : 'Producto no encontrado'
            })
        }

        
        borrarArchivo(productoDB.img,"productos");
        
        productoDB.img = nombreArchivo;

        productoDB.save((err,productoGuardado)=>{
            res.json({
                ok:true,
                producto:productoGuardado
            })
        })

    });
}

function borrarArchivo(nombreArchivo,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreArchivo}`) 
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;