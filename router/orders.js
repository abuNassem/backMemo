const auth = require('../auth/auth');
const Users = require('../model/schemaUsers');

const orderRouter=require('express').Router()






orderRouter.post('/orders',auth, async (req, res) => {
  const data = req.body;

  try {
  
    if (!data.address || !data.name || !data.phone) {
      return res.status(400).json({ message: 'One or more required fields are missing' });
    }

    // حساب السعر الإجمالي
    const arryOfPrice = data.items.map(ele => ele.quantity * (Number(ele.price) - Number(ele.discount || 0)));
    const totalPrice = arryOfPrice.reduce((curr, total) => curr + total, 0);

    const now = new Date();
    const orderId = now.getTime();

    // إنشاء الطلب
     const order= {
      orderId: orderId,
      address: data.address,
      fullName: data.name,
      phone: data.phone,
      items: [...data.items],
      totalPrice: totalPrice,
      priceWithDelavery:totalPrice+20,
      status: 'pending',
      dateOrder: now.toISOString() 
    }
    const newOrder = await Users.findOneAndUpdate({email:req.user.email},{$push:{orders:order}});

   return res.status(200).json(newOrder.orders);

  } catch (error) {
    if (error.code === 11000) { // مفتاح مكرر
      return res.status(400).json({ message: 'Your data already exists' });
    }

  return  res.status(500).json({ message: 'Server error' });
  }
});



orderRouter.get('/orders',auth, async (req, res) => {
  try {
    const orders = await Users.findOne({email:req.user.email});
    res.status(200).json(orders.orders);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});


module.exports=orderRouter