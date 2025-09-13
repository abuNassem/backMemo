
const mongo=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const validator=require('validator');

const users=new mongo.Schema({
  googleId:{type:String}
  ,
  role:{type:String,default:'user'}
  ,
    userName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        validate(val){
            if(!validator.isEmail(val)){
 throw new Error('This is not a valid email syntax');            }
        },
        unique:true
    },
    passWord:{
        type:String,
        minlength:5,
        required:true
    },
  items: {
    type: [
      {
        title: String,
        cat_prefix: String,
        img: String,
        price: String,
        quantity: Number,
        isInCart: Boolean,
        isFavorit: Boolean,
        discount: Number,
        about: String,
        color: String,
        size: { type: String, enum: ["XS", "S", "M", "L", "XL", "2XL"] },
        brand: String,
        gender: { type: String, enum: ["male", "female", "unisex"] },
        material: { type: String, enum: ["cotton", "polyester", "wool"] },
        subcategory: String,
        rating: Number,
        addedDate: String,
        owner: { type: String, required: true }
      }
    ],
    default: [] // يبدأ فارغ
  },

  // المفضلة
  favorit: {
    type: [
      {
        title: { type: String, required: true },
        img: { type: String, required: true },
        owner: { type: String, required: true }
      }
    ],
    default: [] // يبدأ فارغ
  },

  // الطلبات
  orders: {
    type: [
      {
        address: { type: String, required: true },
        phone: { type: String, required: true },
        fullName: { type: String, required: true, trim: true },
        items: [
          {
            id: { type: Number, required: true },
            title: String,
            cat_prefix: String,
            img: String,
            price: String,
            quantity: Number,
            isInCart: Boolean,
            isFavorit: Boolean,
            discount: Number,
            about: String,
            color: String,
            size: { type: String, enum: ["XS", "S", "M", "L", "XL", "2XL"] },
            brand: String,
            gender: { type: String, enum: ["male", "female", "unisex"] },
            material: { type: String, enum: ["cotton", "polyester", "wool"] },
            subcategory: String,
            rating: Number,
            addedDate: String
          }
        ],
        totalPrice: { type: Number, required: true },
        status: {
          type: String,
          enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
          default: 'pending'
        },
        paymentMethod: {
          type: String,
          enum: ['cash', 'credit_card', 'paypal'],
          required: true,
          default: 'cash'
        },
        paymentStatus: {
          type: String,
          enum: ['paid', 'unpaid', 'refunded'],
          default: 'unpaid'
        },
        priceWithDelavery: { type: Number, required: true },
        dateOrder: { type: String, required: true }
      }
    ],
    default: [] // يبدأ فارغ
  }
  ,
    tokens:[{
      type:String,
      required:true
    }],
})

users.pre('save',async function(){
  const user=this
  if(user.isModified('passWord')){
    const hashed=await bcrypt.hash(user.passWord,8)
    user.passWord=hashed
  }
  
})


users.methods.createTokens=async function (next){
  const user =this
  const token=jwt.sign({_id:user._id.toString()},'ecommerce')

  user.tokens=user.tokens.concat(token)
  await user.save()
  return {user:{email:user.email,userName:user.userName},token:token}
}

const Users=mongo.model('user',users)
module.exports=Users