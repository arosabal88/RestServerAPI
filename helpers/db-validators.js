
const { Categoria , Role, Usuario, Producto } = require('../models');



const esRoleValido = async ( rol= '') => {
  const existeRol = await Role.findOne({rol});
    // const existeRol = await Role.findOne({rol,maxTimeMS: 20});
    if (!existeRol){
           throw new Error(`El rol ${rol} no existe en la Base de Datos`);
    }


  }
const esEmailValido = async (correo = '') => {
 const existeEmail= await Usuario.findOne({correo});
  if(existeEmail) {
    throw new Error(`Este email ${correo} ya está registrado`);
     
  }
 
}
 
const existeUsuarioPorId = async ( id ) => {
  const existeUsuario= await Usuario.findById(id);
    if(!existeUsuario) {
     throw new Error(`El usuario con id ${id} no existe en la Base de datos`);
      
   }
  
 } 
 const existeCategoriaPorId = async ( id ) => {
   const existeCategoria = await Categoria.findById(id);
     if(!existeCategoria) {
       throw new Error(`La categoria con id :  ${id} no existe en la Base de datos`);
 } 

 }

 const existeProductoPorId = async ( id ) => {
   const existeProducto = await Producto.findById(id);
   if(!existeProducto) {
    throw new Error(`El producto con id :  ${id} no existe en la Base de datos`);
} 



 }
 



  module.exports = {
    esRoleValido,
    esEmailValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}