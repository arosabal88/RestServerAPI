
const {Router} = require('express');
const {check} = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const {esAdminRole, tieneRol } = require('../middlewares/validar-roles');

const {
       validarCampos,
       validarJWT,
       esAdminRole,
       tieneRol
} = require('../middlewares');

const { esRoleValido, esEmailValido,existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
       usuariosPut, 
       usuariosPost, 
       usuariosDelete, 
       usuariosPatch } = require('../controllers/usuarios');



const router = Router();

router.get('/',usuariosGet);


router.put('/:id',[
       check('id','No es un id valido').isMongoId(),
       check('id').custom(existeUsuarioPorId),
       check('rol').custom(esRoleValido),
       validarCampos  
], usuariosPut);


router.post('/',[
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),  
            check('password', 'El password debe ser de mas de 6 letras').isLength({min:6}),
            check('correo', 'El correo no es válido').isEmail(),
            check('correo').custom(esEmailValido),
            check('rol').custom(esRoleValido),
            validarCampos   
],usuariosPost); 



router.delete('/:id',[
       validarJWT,
       // esAdminRole,
       tieneRol('ADMIN_ROLE', 'VENTAS_ROLE','NUEVO_ROL'),
       check('id','No es un id valido').isMongoId(),
       check('id').custom(existeUsuarioPorId),
       validarCampos
],usuariosDelete);

router.patch('/',usuariosPatch);
 
  

module.exports = router;