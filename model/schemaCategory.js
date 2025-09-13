
const mongo=require('mongoose')

const categorySchema= new mongo.Schema({
    id:{type:Number},
    title:{type:String},
    prefix:{type:String},
    img:{type:String}
})

const Category=mongo.model('categories',categorySchema)
module.exports=Category