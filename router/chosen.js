const auth = require('../auth/auth')
const Users = require('../model/schemaUsers')

const chosenRouter=require('express').Router()



chosenRouter.post('/chosen/:id',auth,async(req,res)=>{
    try{
        const id=req.params.id
const chosenItem=req.body
  const updateChosen={
    ...chosenItem,
    isInCart:true,
    quantity:1,
    owner:id
  }
   const products=await Users.findOneAndUpdate({email:req.user.email},{$push:{items:updateChosen}},{new:true})
   res.status(200).json(products.items)
    }
    catch(error){
        res.json(error)
    }
  

})

// to delete product from user

chosenRouter.delete('/chosen/:id',auth,(req,res)=>{
  const {id}=req.params
  
  Users.findOneAndUpdate({email:req.user.email},{$pull:{items:{_id:id}}},{new:true})
  .then(user=>{
    res.status(200).json(user)
  })
  .catch(error=>{
    res.status(400).json({message:error})
  })
})

chosenRouter.get('/chosen',auth,async(req,res)=>{
 const data= await Users.findOne({email:req.user.email})
  res.status(200).json(data.items)
})

// delete all chosen
chosenRouter.delete('/chosen',auth,(req,res)=>{
   Users.findOneAndUpdate({email:req.user.email},{$set:{items:[]}},{new:true})
  .then(product=>{
    res.status(200).json(product)
  })
  .catch(error=>{
    res.status(400).json({message:error})
  })
})

chosenRouter.patch('/chosen/:id',auth,(req,res)=>{
  const {id}=req.params
  const mode=req.body.mode
if(mode=='inc'){
  Users.findOneAndUpdate({email:req.user.email,"items.owner":id},{$inc:{"items.$.quantity":1}},{new:true})
  .then(data=>{
    res.status(200).json(data)
  })
  .catch(error=>{
    res.status(400).json({message:error})})
}else{
    Users.findOneAndUpdate({email:req.user.email,"items.owner":id},{$inc:{"items.$.quantity":-1}},{new:true})
    .then(data=>{
    res.status(200).json(data)
  })
  .catch(error=>{
    res.status(400).json({message:error})})
}
})



module.exports=chosenRouter