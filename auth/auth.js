const jwt = require('jsonwebtoken');
const Users = require('../model/schemaUsers');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send('No token provided');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const decoded = jwt.verify(token, 'ecommerce');

    const user = await Users.findOne({ _id: decoded._id, tokens: token });

    if (!user) {
      return res.status(404).send('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate', details: err.message });
  }
};

module.exports = auth;
