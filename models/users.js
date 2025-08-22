const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required : function(){
            return !this.googleId;
        },
        unique: true,
        trim: true
    },

    password : {
        type: String,
        required: function (){
            return !this.googleId;
        }
    },

    

    //Oauth specific fields
    googleId:{
        type: String,
        unique: true,
        sparse: true
    },

    displayName: String,

    registrationMethod: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },

    //link accounts
    linkedAccounts: {
        local: {
            username: String,
            hasPassword: Boolean
        },

        google: {
            id: String,
            email: String
        }
    }
})

module.exports = mongoose.model('User', userSchema)