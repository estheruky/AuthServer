// esto es opcional para que aqui nos salga el inteligence
const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');





const crearUsuario = async (req,res=response)=>{
   //console.log(req.body);
  
   const {email,name,password}= req.body;
 //  console.log(email,name,password);




      try {


            // verificar el email que no exista

               const usuario = await Usuario.findOne({email: email});

               if(usuario){
                  return res.status(400).json({
                     ok:false,
                     msg: 'El usuario ya existe con este mail'
                  });
               }

               // crear usuario con el modelo
               const dbUser = new Usuario(req.body);

               // hash la contraseña

               const salt = bcrypt.genSaltSync();
               dbUser.password=bcrypt.hashSync(password, salt);


               // general json wev token
               
               const token = await generarJWT(dbUser.id,name);

               // crear usuario de bbdd


               await dbUser.save();


               // generar respuesta existosa

               return res.status(201).json({
                  ok:true,
                  uid:dbUser.id,
                  name,
                  email,
                  token
               
               });
         
      } catch (error) {
         console.log(error);
         return res.status(500).json({
            ok:false,
            msg: 'Error en crear usuario hable con administrador'
         });
         
      }



   
   }
 const loginUsuario =  async (req,res=response)=>{

   const {email,password}= req.body;

   try {

      const dbUser = await Usuario.findOne({email});

      if(!dbUser){
         return res.status(400).json({
            ok:false,
            msg: 'El correo no existe'
         });
      }

      // confirmar si el password hace match
      const validPassword = bcrypt.compareSync( password,dbUser.password);
      if(!validPassword){
         return res.status(400).json({
            ok:false,
            msg: 'El password no es valido'
         });

      }


      // General del JWT

      const token = await generarJWT(dbUser.id,dbUser.name);




      // respuesta del servicio
      return res.json({
         ok:true,
         uid: dbUser.id,
         name: dbUser.name,
         email:dbUser.email,
         token
        
      })
      
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         ok:false,
         msg: 'Error login de usuario hable con administrador'
      });
   }


  
   }






  const revalidarToken= async (req,res=response)=>{

   const {uid,name} = req;
   console.log(uid);
  

  
   const dbUser = await Usuario.findById({uid});
 
   console.log(dbUser.name);
   console.log(dbUser.email);
   const token = await generarJWT(uid,name);

    return res.json({
       ok:true,
       uid,
       name:name,
       email:dbUser.email,
       token
       
    });
   }


  module.exports=  {
    crearUsuario,
    loginUsuario,
    revalidarToken
  }