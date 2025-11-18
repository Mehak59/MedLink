const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    purchasedMedicines: [{
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        date: { type: Date, default: Date.now }
    }]
})

let userModel=new mongoose.model('User',userSchema)

module.exports=userModel
