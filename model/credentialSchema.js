const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    session_id:{
        type:String,
        required:true
    }
})

const Credential = mongoose.model('CREDENTIAL',credentialSchema)

module.exports = Credential;