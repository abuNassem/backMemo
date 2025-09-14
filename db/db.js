const mongoose = require('mongoose');
require('dotenv').config();

const dburl = process.env.DB_URL;

mongoose.connect(dburl)
  .then(() => {
    
//     collection.dropIndex("orders.orderId_1").catch(err => {
//       if (err.codeName !== 'IndexNotFound') console.error(err);
//     });
//  collection.dropIndex("favorit.id_1").catch(err => {
//       if (err.codeName !== 'IndexNotFound') console.error(err);
//     });

//  collection.dropIndex("items.id_1").catch(err => {
//       if (err.codeName !== 'IndexNotFound') console.error(err);
//     });

    console.log('Connected successfully');
  })
  .catch(err => console.error(err));

module.exports = mongoose;
