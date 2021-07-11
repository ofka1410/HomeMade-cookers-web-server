const express= require('express')
const order= require('../controlers/orders/orders_action')
const router = express.Router();
router.route("/").post(order.orders);
module.exports = router;