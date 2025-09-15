const auth = require('../auth/auth')
const Users = require('../model/schemaUsers')
const db=require('mongoose')
const chosenRouter=require('express').Router()


chosenRouter.get('/chosen',auth,async(req,res)=>{
 const data= await Users.findOne({email:req.user.email})
  res.status(200).json(data.items)
})

chosenRouter.post('/chosen/:id',auth,async(req,res)=>{
    try{
            const _id=req.params.id
            const ele=await Users.findOne({email:req.user.email,'items._id':_id})
      if(ele) return ;
const chosenItem=req.body
  const updateChosen={
    ...chosenItem,
    isInCart:true,
    quantity:1,
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

chosenRouter.patch('/chosen/:id',auth,async(req,res)=>{
  const {id}=req.params
  const mode=req.body.mode
if(mode=='inc'){
  Users.updateOne({email:req.user.email,"items._id":id},{$inc:{"items.$.quantity":1}})
  .then(async()=>{
  console.log('don inc')
    res.status(200).json(await Users.findOne({email:req.user.email}))
  })
  .catch(error=>{
    res.status(400).json({message:error})})

    
}else{
    Users.findOneAndUpdate({email:req.user.email,"items._id":id},{$inc:{"items.$.quantity":-1}},{new:true})
    .then(data=>{
    res.status(200).json(data)
      console.log('don dec')

  })
  .catch(error=>{
    res.status(400).json({message:error})})
}
})



module.exports=chosenRouter