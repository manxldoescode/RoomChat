const User = require('../models/users.js')
const bcrypt = require('bcryptjs')



//register

const registerUser = async(req,res) => {
    try{
        //extract user information from the request body
        const {username, password} = req.body;

        //check if the user already exists in the db
        const checkUser = await User.findOne({username})
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            })
        }

        //hash the password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //create a new user and saving it in the db
        const newUser = new User({
            username,
            password : hashedPassword
        })

        await newUser.save()

        if(newUser){
            res.status(201).json({
                success: true,
                message: "User registered successfully"
            })
        } else {
            res.status(400).json({
                success: false,
                message : "unable to register the user please try again"
            })
        }

    } catch(e) {
        console.log(e);
        res.status(500).json({
            success : false,
            messgae : "some error occurred during registeration"
        })
        
    }
}

//login controller
const loginUser = async(req,res) => {
    try {

    } catch (e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occured during login"
        })
        
    }
}


module.exports = { registerUser, loginUser }