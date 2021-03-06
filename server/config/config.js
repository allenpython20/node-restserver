/*==========*/
/*PUERTO*/
/*==========*/

process.env.PORT = process.env.PORT || 3000;

//====================
//Entorno
//=====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
//Caducidad del token
//=====================

process.env.CADUCIDAD_TOKEN = '48hr';


//====================
//SEED->Semilla del token
//=====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';




//====================
//Base de Datos
//=====================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
   urlDB='mongodb://localhost:27017/cafe';
}else{
    urlDB= process.env.MONGO_URI;//nuestra variable de entorno
}

process.env.URLDB= urlDB;


//====================
//ID cliente

//=====================
process.env.CLIENT_ID = process.env.CLIENT_ID || "402955765914-onn62uuuv9t95p05vfghenmdugskkfsr.apps.googleusercontent.com"