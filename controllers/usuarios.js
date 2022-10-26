
const {request, response} = require ('express');
const bcrypjs = require('bcryptjs');

// la mayuscula en Usuario es un estandar,
//  que va a permitir crear instancias del modelo
const Usuario = require('../models/usuario');
const { findByIdAndDelete } = require('../models/role');
const { findByIdAndUpdate } = require('../models/usuario');

// -----------------------------------------------------
const usuariosGet = async  (req = request, res = response) => {
   //  const {q,nombre = 'No name', apikey, page=1, limit} = req.query;
   const { limite=5, desde = 0 } = req.query;
   const query = {estado: true};
   
   const [total, usuarios] = await Promise.all ([
      Usuario.countDocuments(query),
      Usuario.find(query)
      .limit(limite) //no fue necesario
      .skip(desde)
   ]);

    res.json({
      total,
      usuarios
    });
 };
// -----------------------------------------------------
const usuariosPost = async  (req , res = response) => {

      
    const {nombre,correo,password,rol} = req.body;

    //del body la instancia del usuario solo coge 
   //  las propiedades definidas en el modelo
   // el resto mongoose las ignora
    const usuario = new Usuario({nombre,correo,password,rol}); 

  
   // Encriptar la contraseña

   const salt = bcrypjs.genSaltSync(10);
   usuario.password = bcrypjs.hashSync(password,salt);


   // Guardar en DB
    await usuario.save();
    
    res.json({
       msg: 'post API- usuarios Post Controlador',
       usuario
    });
 };

 // -----------------------------------------------------

const usuariosPut = async(req, res = response) => {
    const {id}  = req.params;
    const{_id ,password, google,correo,...resto } = req.body;
   //  TODO Validar contra base de datos
   if(password) {
      // encriptar la contraseña
      const salt = bcrypjs.genSaltSync(10);
      resto.password = bcrypjs.hashSync(password,salt);
   }  
   const usuario = await Usuario.findByIdAndUpdate(id, resto);

    
    res.json(usuario);
 };

 // -----------------------------------------------------
 const usuariosPatch = (req, res = response) => {
    
    res.json({
       msg: 'patch API- usuarios Patch Controlador'
    });
 };

 // -----------------------------------------------------

const usuariosDelete = async(req, res = response) => {
   const {id} = req.params;

   const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});
  
   res.json({
      usuario,
   });
 }









 module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
 }