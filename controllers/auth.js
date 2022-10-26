
const { request,response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario =require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');


const login = async(req = request , res=response) => {

    const {correo, password} = req.body;

    try {
         // Validar que exista el correo

        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario/password no son correctos-Email'
            });
            
        }
        // Validar que el usuario este activo
         if(!usuario.estado){
            return res.status(400).json({
                msg:'usuario/password no son correctos- Estado:False'
            });
         }



        // Validar la contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario/password no son correctos-password'
            });
            
        }

        // Generar el JWT  
         const token = await generarJWT(usuario.id);
        

        res.json({
            usuario,
             token           
        })
   
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:'Hable con el admin'
        });
        
    }

}

const googleSignin = async (req, res = response) => {
    const {id_token} = req.body;
    
    try {

        const {nombre,correo,img} = await googleVerify(id_token);
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            // tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
                 

            };
         usuario = new Usuario(data); 
         await usuario.save();

        }

        // Verificar estado del usuario en mi app
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el admin, usuario bloqueado',
            })

        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: "Todo ok!Google Signin",
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg:'Token de Google no valido' 
         })
        
    }
    

    
}


module.exports= {
    login,
    googleSignin
}