const auth = require('../auth/auth');
const Product = require('../model/schemaProduct');

const productRouter=require('express').Router()



productRouter.get('/productapi',async (req, res) => {
  try {
    if (req.query.cat_prefix) {
      const filterValue = req.query.cat_prefix;
      // نفترض أنك تريد فلترة حسب حقل معين، مثلاً cat_prefix
      const filteredData = await Product.find({ cat_prefix: filterValue });
      return res.json(filteredData);
    } else {
      const allData = await Product.find();
      return res.json(allData);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});



productRouter.get('/productapi/:id', async (req, res) => {
  const _id =req.params.id;  // تحويل النص إلى رقم
  const data = await Product.findOne({_id});
  if (!data) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(data);
});

// to up date element
productRouter.patch('/productapi/:id', async (req, res) => {
  try {
    const _id = Number(req.params.id);
    const updates = req.body; 

    const updatedProduct = await Product.findOneAndUpdate(
      { _id },
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports=productRouter