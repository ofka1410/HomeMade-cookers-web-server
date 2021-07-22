const express= require('express')
const order= require('../controlers/orders/orders_action')
const ready = require('../controlers/orders/orders_after_send/ready')
const router = express.Router();
router.route("/").put(ready.ready);
module.exports = router;