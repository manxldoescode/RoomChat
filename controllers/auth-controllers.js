const User = require('../models/users.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({
    userId: user._id,
    username: user.username || user.displayName,
    registrationMethod: user.registrationMethod
  }, process.env.JWT_SECRET_KEY, {
    expiresIn: '30m'
  })
}


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
            password : hashedPassword,
            registrationMethod: 'local'
        })

        await newUser.save()

        if(newUser){

            const accessToken = generateToken(newUser);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                accessToken,
                user:{
                    id: newUser._id,
                    username: newUser.username,
                    registrationMethod: newUser.registrationMethod
                }

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
            return res.status(400).json({
                success : false,
                message : "Invalid Username or password"
            })
        }

        //check if the user resgistered via google or has no passwrd
        if(user.googleId && !user.password) {
            return res.status(400).json({
                success: false,
                message: "please login with google or set a password"
            })
        }


        //if the password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials or account is made up by google"
            })
        }

        const accessToken = generateToken(user);

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

//google oauth handler
const googleAuthSuccess = async(req, res) => {
    try{
        //user is available in req.user after successfull oath
        const user = req.user;

        if(!user){
            return res.status(400).json({
                success: false,
                message: "google authentication failed"
            })
        }

        const accessToken = generateToken(user)

        //redirect to frontend with token and json response

        res.status(200).json({
            success: true,
            message: "google authentication successfully",
            accessToken,

        })
    } catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "error during google authentication"
        });
        
    }
}


//google oauth failure handler

const googleAuthFailure = (req, res) => {
    res.status(400).json({
        success: false,
        message: "Google authentication failed"
    })
}

module.exports = { registerUser, loginUser, googleAuthSuccess, googleAuthFailure }