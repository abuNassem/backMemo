const oAuthGoogle=require('express').Router()
require('dotenv').config()
const session = require('express-session');
const passport = require('passport');
const Users = require('../model/schemaUsers');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto=require('crypto');
const auth = require('../auth/auth');

oAuthGoogle.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));

oAuthGoogle.use(passport.initialize());
oAuthGoogle.use(passport.session());

// 🔹 Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://backmemo.onrender.com/auth/google/callback" 
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile); // هنا ممكن تخزن المستخدم في DB
  }
));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

oAuthGoogle.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'],  prompt: 'select_account' })
);


oAuthGoogle.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  async(req, res) => {
     try {
    if (!req.isAuthenticated()) {
      return res.status(404).json({ message: 'unathuntaction' }) 
    }

    const idUser = req.user.id
    const emailUser = req.user.emails[0].value
    const nameUser = req.user.displayName

    const userSame = await Users.findOne({ email: emailUser })

    if (userSame && userSame.googleId === idUser) {
      const user = await userSame.createTokens()
      console.log('login')
           res.redirect(`https://backmemo.onrender.com/auth?token=${user.token}`); 
    } else if (userSame && userSame.googleId !== idUser) {
      return res.status(404).json({ message: 'this email already exists' }) 
    } else {
      const rdmPass = crypto.randomBytes(12).toString('hex')
      const newUser = new Users({
        email: emailUser,
        passWord: rdmPass,
        userName: nameUser,
        items: [],
        favorit: [],
        orders: [],
        googleId: idUser
      })

      const user = await newUser.createTokens()
            console.log('sign up')

           res.redirect(`http://localhost:5173/auth?token=${user.token}`); 

    }
  } catch (error) {
    console.log(error)
    return res.status(400).json(error) 
  }
   
  }
);
oAuthGoogle.get('/auth/profile',auth,async(req,res)=>{
    try{
        const user=await Users.findOne({tokens:req.token})
        if(!user){
            res.status(404).json({message:'user not found'})
        }
        res.status(200).json({token:req.token,email:user.email,userName:user.userName})
            }
    catch(error){
        res.status(400).json(error)
        }
})
module.exports=oAuthGoogle