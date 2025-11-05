const auth = require('../auth/auth')
const Users = require('../model/schemaUsers')

const favorityRouter=require('express').Router()

favorityRouter.post('/favorit',auth,async(req,res)=>{
  const favoItem=req.body
  const newData=await Users.findOneAndUpdate({email:req.user.email},{$push:{favorit:favoItem}},{new:true})
  res.status(200).json(newData)
  
})

favorityRouter.get('/favorit',auth,async(req,res)=>{
    try{
        const data=await  Users.findOne({email:req.user.email})
        if(!data){
            res.status(404).json('element not exist')
        }
        res.status(200).json(data.favorit)
  
    }
    catch(error){
        res.json(error)
    }

})

favorityRouter.delete('/favorit/:id',auth, async (req, res) => {
  const _id=req.params.id
  try {
    const user = await Users.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { favorit: {owner:_id } } }, 
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });

    }
    res.status(200).json(user.favorit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports=favorityRouter
