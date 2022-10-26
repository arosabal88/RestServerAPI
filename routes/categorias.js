
 
 
const {Router} = require('express');
const {check} = require('express-validator');

const { login, googleSignin } = require('../controllers/auth');
const { validarJWT, validarCampos, esAdminRole  } = require('../middlewares');
const { actualizarCategoria,
        crearCategoria,
        obtenerCategoria,
        obtenerCategorias,  
        borrarCategoria
      } = require ('../controllers/categorias');
const {existeCategoriaPorId} = require ('../helpers/db-validators');


// -----------------------------------------------------

const router = Router();

//  {{url}}/api/categorias

// Obtener todas las categorias-public
router.get('/',obtenerCategorias);


// Obtener una categoria por id-public
router.get('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria);


// Crear categoria-privado-cualquier persona con un token valido

router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria
);


// Actualizar categoria-privado-cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos,
    check('id').custom(existeCategoriaPorId),
],actualizarCategoria
);


// Borrar una categoria-Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId),
],borrarCategoria
);



// -----------------------------------------------------
module.exports= router;
