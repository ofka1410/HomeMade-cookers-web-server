const express= require('express')
const order= require('../controlers/orders/orders_action')
const ready = require('../controlers/orders/orders_after_send/ready')
const rejected_order = require('../controlers/orders/orders_after_send/rejected_order')
const router = express.Router();
router.route("/").put(ready.ready);
router.route("/").post(rejected_order.rejected);
module.exports = router;