const Category = require('../model/schemaCategory')

const categoryRouter=require('express').Router()


categoryRouter.get('/category',async(req,res)=>{
  try{
    const data=await Category.find({})
    res.json(data)
  }catch(error){
    console.log(error)
}
}
)


module.exports=categoryRouter