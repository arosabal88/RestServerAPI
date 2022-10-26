//  Controller 
const {Router} = require('express');
const {check} = require('express-validator');

const { login, googleSignin } = require('../controllers/auth');
const { validarJWT, validarCampos, esAdminRole  } = require('../middlewares');
const { obtenerProductos,
        obtenerProducto,
        crearProducto,
        actualizarProducto,
        borrarProducto
       } = require('../controllers/productos');

const {existeCategoriaPorId, existeProductoPorId} = require ('../helpers/db-validators');


// -----------------------------------------------------

const router = Router();

//  {{url}}/api/productos

// Obtener todos los productos-public
router.get('/',obtenerProductos);


// Obtener una producto por id-public
router.get('/:id',[
     check('id','No es un id de mongo valido').isMongoId(),
     check('id').custom(existeProductoPorId),
     validarCampos
],obtenerProducto);


// Crear producto-privado-cualquier persona con un token valido

router.post('/', [
      validarJWT,
      check('nombre','El nombre es obligatorio').not().isEmpty(),
      check('categoria').custom(existeCategoriaPorId),
      validarCampos
],crearProducto);

// // (req, res = response) => {
//     return res.status(200).json({
//         msg:'Crear producto ok'
//     })
//     }
// Actualizar producto-privado-cualquiera con token valido
router.put('/:id',[
    // validarJWT,
    // check('id', 'No es un id valido').isMongoId(),
    // check('nombre','El nombre es obligatorio').not().isEmpty(),
    // validarCampos,
    // check('id').custom(existeCategoriaPorId),
],actualizarProducto
);


// Borrar un producto-Admin
router.delete('/:id',[
    // validarJWT,
    // esAdminRole,
    // check('id', 'No es un id valido').isMongoId(),
    // validarCampos,
    // check('id').custom(existeCategoriaPorId),
],borrarProducto
);



// -----------------------------------------------------
module.exports= router;
