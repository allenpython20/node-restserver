
const moongose = require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

let rolesValidos ={
    values:['ADMIN_ROLE','USER_ROLE'],
    message : '{VALUE} no es un rol valido'/*el VALUE es el rol incorrecto*/
}

let Schema = moongose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type : String,
        required : [true,"El nombre es necesario"]
    },
    email:{
        unique : true,
        type : String,
        required:[true,"El email es necesario"]
    },
    password : {
        type : String,
        required:[true,"El password es necesario"]
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos//Verifica que el rol se encuenta en los values

    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }

    
})


usuarioSchema.methods.toJSON=function(){//cada vez que quieras imprimir el JSON,se usa function y no flecha para q devuelva el this
   
    let user=this;

    let userObject = user.toObject();

    delete userObject.password;//borra la propiedad del objeto

    return userObject;


};

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico'})//el PATH es nombre de la propiedad

module.exports = moongose.model('Usuario',usuarioSchema)