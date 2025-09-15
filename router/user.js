const auth = require('../auth/auth')
const Users = require('../model/schemaUsers')
const bcrypt=require('bcrypt')
const userRouter=require('express').Router()



userRouter.get('/users',async(req,res)=>{
  try{
    const data=await schemaUsers.find()
    res.status(200).json(data)
  }
  catch(error){
    res.status(400).json({message:error})
  }
})

// send users
userRouter.post('/users',async(req,res)=>{
  try {
    const newUser = new Users({...req.body,items:[],favorit:[],orders:[]});
   const{token,user}= await newUser.createTokens()
    
    res.status(200).json({ message: 'User created successfully',user:user,token:token });
  } catch (err) {
    console.log(err)
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).send({ error: firstError });
    }

    if (err.code === 11000) {
      return res.status(400).send({ error: 'Email already exists' });
    }
        res.status(400).send({ error: 'there is error try again' });
  }

  
})





userRouter.post('/login', async(req, res) => {
  const sendedEmail = req.body.email;
  const sendedPassWord = req.body.passWord;

try{
  
const user= await   Users.findOne({ email: sendedEmail })
if(!user){ res.status(400).json({ message: 'this email not found or uncorrect' });}
const {_,token}=await user.createTokens()
const isCorrect=await bcrypt.compare(sendedPassWord,user.passWord)

if(!isCorrect){
   res.status(400).json({ message: 'password incorrect' });
}


 res.status(200).json({
          user: {
            email: user.email,
            userName: user.userName
          },
          token:token,
          message: 'User login successfully'
        }
        )
  
}
catch(error){
  console.log(error)
}
 
});

userRouter.get('/logout',auth,async(req,res)=>{
try{
req.user.tokens=req.user.tokens.filter(item=>{
    return item !==req.token
    })

    await req.user.save()
    res.json(req.user)
    console.log(req.user)
}
catch(error){
  console.log('logout error'+error)
}
   

})

module.exports=userRouter