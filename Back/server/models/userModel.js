// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  suscripcion:{
    endpoint:{
        type: String,
        unique:true,
        sparse: true 
    },
    expireTime:{
        type:Date
    },
    keys:{
        p256dh:{
            type:String,
        },
        auth:{
            type:String 
        }
  }
}
  

});

module.exports = mongoose.model('users', UserSchema, 'pwasUsers');
