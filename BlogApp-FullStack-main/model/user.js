let mongoose = require('mongoose');
const {Schema} = mongoose;


let userSchema = new mongoose.Schema({

    username : String,
    email: String,
    password : String,
    is_verified: {type: Boolean, default: false},
    verification_token: { type: String },
    blog:[
        {
            type : Schema.Types.ObjectId,
            ref:"Blog"
        }
    ]
})

module.exports= mongoose.model("User" ,userSchema )