const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const User = require('../models/users')


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/google/callback",
    passReqToCallback   : true
  },
  async(request, accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google profile:', profile);

        //check if the user already exists with this google account
        let user = await User.findOne({googleId: profile.id});

        if (user) {
            //user exists with this account
            return done(null, user);
        }

        //check if the user exists with the same email
        const email = profile.emails?.[0]?.value;

        if(email){
            user = await User.findOne({email: email})
        }

        if(user){
            //link google account to existing local account
            user.googleId = profile.id;
            user.displayName = user.displayName || profile.displayName;
            user.email = user.email || email;
            await user.save();
            return done(null, user)
        }

        //create new user with google auth
        user = new User({
            googleId: profile.id,
            email: email,
            displayName: profile.displayName,
            profilePicture: profile.photos?.[0]?.value,
            registrationMethod: 'google'
        });

        await user.save();
        done(null, user)
    } catch(error){
        console.log("google oauth error", error);
        done(error, null)
    }
  }
));
