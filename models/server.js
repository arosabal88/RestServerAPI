const express = require('express');
const cors = require('cors');
const { dBConnection } = require('../database/config');


class Server {

   // -----------------------------------------------------
   constructor() {

      this.app = express();
      this.port = process.env.PORT;

      this.paths = {
         auth:       '/api/auth',
         categorias: '/api/categorias',
         productos: '/api/productos',
         usuarios:   '/api/usuarios'
      }
        // Conectar a base de datos
         this.conectarDB();

        //  Middlewares
        this.middlewares();

        //   Rutas de mi app
        this.routes();
      }

      async conectarDB () {
         await dBConnection(); 

   }
   // -----------------------------------------------------
   middlewares() {

   // CORS
   this.app.use(cors());   

   // Lectura y parseo del body

   this.app.use(express.json());
       
   // Directorio público
      this.app.use(express.static('public'));
   }
         
   // -----------------------------------------------------
   routes() {
      this.app.use( this.paths.auth,       require('../routes/auth') );
      this.app.use( this.paths.categorias, require('../routes/categorias') );
      this.app.use( this.paths.productos, require('../routes/productos') );
      this.app.use( this.paths.usuarios,   require('../routes/usuarios') );
   }
   // -----------------------------------------------------
   listen() {
        this.app.listen(this.port,() => {
           console.log(`Example app listening at http://localhost: ${this.port}`); 
        });

    }
    // -----------------------------------------------------

}

module.exports =Server;


