const express= require('express')
const order= require('../controlers/orders/orders_action')
const deletefalse = require('../controlers/Develope_delete')
const router = express.Router();
router.route("/").get(deletefalse.orders);
module.exports = router;