
const{ response, request } = require('express');
const {Producto} = require('../models');

// -----------------------------------------------------
// Obtener productos- Paginado-Total-populate

const obtenerProductos = async ( req = request,res = response ) => {
     const {limite, desde} = req.query;
     const query = {estado:true};
     const [total, productos] = await Promise.all ([
         Producto.countDocuments(query),
         Producto.find(query)
         .populate('usuario', 'nombre')
         .populate('categoria', 'nombre')
         .limit(limite) 
        .skip(desde)
     ]);


    res.json({
        total,
       productos
    })
};



// -----------------------------------------------------
// Obtener producto-populate

const obtenerProducto = async ( req = request, res = response ) => {
 
     const {id}  = req.params;
     const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria','nombre');
    
     res.status(201).json(producto)
  
}

// -----------------------------------------------------
// Crear producto-privado-cualquiera con token valido

const crearProducto = async( req , res = response ) =>{
   
     const nombre = req.body.nombre.toUpperCase();
     const productoDB = await Producto.findOne({nombre});
     if(productoDB) {
        return res.status(400).json ({
            msg:`El producto ${productoDB.nombre}, ya existe`
        });
     }       
//  generar el codigo de la data a guardar
     
    const {precio, descripcion, disponible,categoria} = req.body;
    const data = {
        nombre,
        precio,
        descripcion,
        disponible,
        categoria,
        usuario: req.usuario._id,
        
    }

    const producto = new Producto(data);
    await producto.save();
    res.status(201).json(producto)

}
// -----------------------------------------------------
// Actualizar producto-privado-cualquiera con token valido

const actualizarProducto = async ( req, res = response ) => {

     const {id} = req.params;
     const {estado,usuario,...data} = req.body;
     data.nombre = data.nombre.toUpperCase();
     data.usuario = req.usuario._id;

     const producto = await Producto.findByIdAndUpdate(id, data, {new:true})
     .populate( 'usuario', 'nombre' )
     .populate('categoria','nombre');
    
      res.status(201).json(producto);

   
}
// -----------------------------------------------------
// Borrrar producto-estado:false
const borrarProducto = async ( req , res = response ) => {

   const {id} = req.params;
   const productoBorrado = await Producto.findByIdAndUpdate(id,{estado:false}, {new:true});
  
   res.json({
     productoBorrado,
    });
    

}


module.exports = {
 obtenerProducto,
 obtenerProductos,
 crearProducto,
 actualizarProducto,
 borrarProducto
}