const mongoose = require("mongoose");
Schema = mongoose.Schema;
const connectionString = 'mongodb+srv://avitronproperty:57DMvPnHyb39iuKO@cluster0.n1flavh.mongodb.net/property_db';
mongoose.connect(connectionString);
const connection = mongoose.connection;
connection.on('error', (error) => {
    console.log(error)
})
connection.once('connected', () => {
    console.log('Database Connected');
})
module.exports = connection;