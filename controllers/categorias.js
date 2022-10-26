
const{ response, request } = require('express');
const {Categoria} = require('../models');
// -----------------------------------------------------
// Obtener categorias- Paginado-Total-populate

const obtenerCategorias = async(req = request,res = response) =>{
    const {limite, desde} = req.query;
    const query = {estado:true};
    const [total, categorias] = await Promise.all ([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .limit(limite) 
        .skip(desde)
     ]);


    res.json({
        total,
       categorias
    })
};



// -----------------------------------------------------
// Obtener categoria-populate

const obtenerCategoria = async( req = request, res = response) =>{
 
    const {id}  = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    
    res.status(201).json(categoria)
  
}

// -----------------------------------------------------
// Crear categoria-privado-cualquiera con token valido

const crearCategoria = async( req , res = response ) =>{

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});
    
    if(categoriaDB) {
        return res.status(400).json ({
            msg:`la categoria ${categoriaDB.nombre}, ya existe`
        });
    }       
    // generar el codigo de la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

const categoria = new Categoria(data);
await categoria.save();
res.status(201).json(categoria)

}
// -----------------------------------------------------
// Actualizar categoria-privado-cualquiera con token valido

const actualizarCategoria = async( req, res = response ) => {

    const {id} = req.params;
    const {estado,usuario,...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true}).populate( 'usuario', 'nombre' );
    res.json(categoria);

   
}
// -----------------------------------------------------
// Borrrar categoria-estado:false
const borrarCategoria = async (req, res = response ) => {

   const {id} = req.params;
   const categoriaBorrada = await Categoria.findByIdAndUpdate(id,{estado:false}, {new:true});
  
   res.json({
     categoriaBorrada,
   });
    

}

// -----------------------------------------------------


module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}