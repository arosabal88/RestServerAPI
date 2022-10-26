

const mongoose = require ('mongoose');

// -----------------------------------------------------
const dBConnection = async() => {

    try {
        // await mongoose.connect(process.env.MONGODB_CNN,{ 
           
        await  mongoose.connect(process.env.MONGODB_CNN,{
                       
            useNewUrlParser:true,
            useUnifiedTopology:true,
            // useFindAndModify: false
        } );
        console.log('Base de datos online');

        
    } catch (error) {

        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
         
    }
}
// -----------------------------------------------------
module.exports = {
    dBConnection
}