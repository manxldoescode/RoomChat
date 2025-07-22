const User = require('../models/users.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



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
        const {username, password} = req.body;
        //find if current user exists in db
        const user = await User.findOne({username})
        if(!user) {
            res.status(400).json({
                success : false,
                message : "Invalid Username or password"
            })
        }

        //if the password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }

        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username
        }, process.env.JWT_SECRET_KEY,{
            expiresIn : '30m'
        })

        res.status(200).json({
            success : true,
            message : "logged in successfully",
            accessToken
        })

    } catch (e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occured during login"
        })
        
    }
}


module.exports = { registerUser, loginUser }