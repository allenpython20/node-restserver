const jwt = require('jsonwebtoken');

let verificaToken = (req,res,next)=>{
    let token =req.get('token');//informacion que se pasa en el header
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({/*error de autentificación*//*sale del middlewares pero no sigue con la ejecución*/
                ok:false,
                err
            })
        }

        req.usuario = decoded.usuario;/*información decodificada,el decoded.usuario->usuario es el campo que se puso al crear el token*/ 
        next()/*sale del middlewares y sigue la ejecucion*/
    })
}

let verificaAdmin_Role = (req,res,next)=>{
    
    let usuario = req.usuario;
    
    if(usuario.role === "ADMIN_ROLE"){
        next()
    }else{
        return res.json({
            ok:false,
            err:{
                message:"El usuario no es admin"
            }
        })
    }




    
}






module.exports={
    verificaToken,
    verificaAdmin_Role
}